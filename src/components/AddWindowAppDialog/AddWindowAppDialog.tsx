import React from 'react';
import SelectWindowAppPage from '../SelectWindowAppPage/SelectWindowAppPage';
import SetWindowAppPositionPage from '../SetWindowAppPositionPage/SetWindowAppPositionPage';
import SetWindowAppSizePage from '../SetWindowAppSizePage/SetWindowAppSizePage';
import { Dialog, IconName } from '@blueprintjs/core/lib/esm/components';
import { FGM_WINDOW_POSITION, FGM_WINDOW_SIZE } from '../../lib/FGM';
import { MaybeElement } from '@blueprintjs/core/lib/esm/common';
import produce from 'immer';
import Logger from '../../lib/Logger';
import styles from './AddWindowAppDialog.module.scss';
import { IAppState } from '../../store/Types';
import { getLocaleNameFromLanguage } from '../../lib/lang';
import { connect } from 'react-redux';

interface DialogPageInfo {
  page: any;
  title: string;
  icon: IconName | MaybeElement;
}

interface IProps {
  langData: any;
  getRef: any;
}

interface IState {
  isOpen: boolean;
  curPageInfo: DialogPageInfo;
}

type onOKCallback = (
  item: any,
  wpos: FGM_WINDOW_POSITION,
  wsize: FGM_WINDOW_SIZE,
  width: number,
  height: number
) => void;

class AddWindowAppDialog extends React.Component<IProps, IState> {
  private selectedItem: any;
  private wpos = FGM_WINDOW_POSITION.MIDDLE_CENTER;
  private wsize = FGM_WINDOW_SIZE.BASED_ON_CLIENT_AREA;
  private width = 0;
  private height = 0;
  private dialogPages: DialogPageInfo[] = [];
  private onOK?: onOKCallback;

  constructor(props: IProps) {
    super(props);
    this.props.getRef.current = this;
    this.reset();
    this.state = {
      isOpen: false,
      curPageInfo: this.dialogPages[0]
    };
  }

  open = async (onOK: onOKCallback) => {
    this.onOK = onOK;
    this.reset();
    this.setState({
      isOpen: true,
      curPageInfo: this.dialogPages[0]
    });
  };

  private reset = () => {
    this.selectedItem = null;
    this.wpos = FGM_WINDOW_POSITION.MIDDLE_CENTER;
    this.wsize = FGM_WINDOW_SIZE.BASED_ON_CLIENT_AREA;
    this.width = 0;
    this.height = 0;
    this.dialogPages = [this.selectAppPageInfo()];
  };

  private pushPage = (pageInfo: DialogPageInfo) => {
    this.dialogPages = produce(this.dialogPages, draft => {
      draft.push(pageInfo);
    });
    this.setState({ curPageInfo: pageInfo });
  };

  private popPage = () => {
    this.dialogPages = produce(this.dialogPages, draft => {
      draft.pop();
    });
    const len = this.dialogPages.length;
    this.setState({ curPageInfo: this.dialogPages[len - 1] });
  };

  private selectAppPageInfo = (): DialogPageInfo => {
    return {
      page: (
        <SelectWindowAppPage onNext={this.onNextFromSelectAppPage} onCancel={this.handleClose} />
      ),
      title: this.props.langData.selectAppPageTitle,
      icon: 'list'
    };
  };

  private setPositionPageInfo = (): DialogPageInfo => {
    return {
      page: (
        <SetWindowAppPositionPage
          onPrev={this.onPrev}
          onNext={this.onNextFromSetPositionPage}
          onCancel={this.handleClose}
        />
      ),
      title: this.props.langData.setPositionPageTitle,
      icon: 'page-layout'
    };
  };

  private setSizePageInfo = (): DialogPageInfo => {
    return {
      page: (
        <SetWindowAppSizePage
          onPrev={this.onPrev}
          onCancel={this.handleClose}
          onOK={this.handleFinish}
        />
      ),
      title: this.props.langData.setSizePageTitle,
      icon: 'page-layout'
    };
  };

  private onPrev = () => {
    this.popPage();
  };

  private onNextFromSelectAppPage = (item: any) => {
    this.selectedItem = item;
    this.pushPage(this.setPositionPageInfo());
  };

  private onNextFromSetPositionPage = (wpos: FGM_WINDOW_POSITION) => {
    this.wpos = wpos;
    this.pushPage(this.setSizePageInfo());
  };

  private handleFinish = (wsize: FGM_WINDOW_SIZE, width: number, height: number) => {
    this.wsize = wsize;
    this.width = width;
    this.height = height;
    if (this.onOK) {
      this.onOK(this.selectedItem, this.wpos, this.wsize, this.width, this.height);
    }

    this.setState({ isOpen: false });
  };

  private handleClose = () => this.setState({ isOpen: false });

  private getStyle = (pageInfo: DialogPageInfo): React.CSSProperties => {
    return {
      display: pageInfo === this.state.curPageInfo ? 'block' : 'none'
    };
  };

  render() {
    Logger.logRenderInfo(this);
    return (
      <Dialog
        className={`bp3-dark ${styles.dialog}`}
        canOutsideClickClose={false}
        onClose={this.handleClose}
        title={this.state.curPageInfo.title}
        icon={this.state.curPageInfo.icon}
        lazy={false}
        {...this.state}
      >
        {this.dialogPages.map(item => (
          <div key={item.title} style={this.getStyle(item)}>
            {item.page}
          </div>
        ))}
      </Dialog>
    );
  }
}

const mapStateToProps = (state: IAppState, ownProps?: any) => {
  Logger.log('AddWindowAppDialog-mapStateToProps, state=', state, ', ownProps=', ownProps);

  const localeName = getLocaleNameFromLanguage(state.currentLanguage);
  const langData: any = require(`./languages/${localeName}.json`);
  return {
    langData: langData
  };
};

export default connect(mapStateToProps)(AddWindowAppDialog);
