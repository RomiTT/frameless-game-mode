import React from 'react';
import { Dialog, Classes, Button } from '@blueprintjs/core';
import Logger from '../../lib/Logger';
import { FGM_WINDOW_POSITION, FGM_WINDOW_SIZE } from '../../lib/FGM';
import styles from './WindowAppPropertyDialog.module.scss';
import { IAppState } from '../../store/Types';
import { getLocaleNameFromLanguage } from '../../lib/lang';
import { connect } from 'react-redux';

class WPosViewer extends React.PureComponent<WPosViewerProps> {
  private getClassName = (wpos: FGM_WINDOW_POSITION) => {
    return this.props.wpos === wpos ? styles.itemSelected : styles.item;
  };

  render() {
    return (
      <div className={styles.wposView}>
        <div className={styles.row}>
          <div className={this.getClassName(FGM_WINDOW_POSITION.LEFT_TOP)} />
          <div className={this.getClassName(FGM_WINDOW_POSITION.MIDDLE_TOP)} />
          <div className={this.getClassName(FGM_WINDOW_POSITION.RIGHT_TOP)} />
        </div>
        <div className={styles.row}>
          <div className={this.getClassName(FGM_WINDOW_POSITION.LEFT_CENTER)} />
          <div className={this.getClassName(FGM_WINDOW_POSITION.MIDDLE_CENTER)} />
          <div className={this.getClassName(FGM_WINDOW_POSITION.RIGHT_CENTER)} />
        </div>
        <div className={styles.row}>
          <div className={this.getClassName(FGM_WINDOW_POSITION.LEFT_BOTTOM)} />
          <div className={this.getClassName(FGM_WINDOW_POSITION.MIDDLE_BOTTOM)} />
          <div className={this.getClassName(FGM_WINDOW_POSITION.RIGHT_BOTTOM)} />
        </div>
      </div>
    );
  }
}

type DialogCallback = () => void;

interface IProps {
  onOK?: DialogCallback;
  langData: any;
  getRef: any;
}

interface IState {
  isOpen: boolean;
}

interface WPosViewerProps {
  wpos: FGM_WINDOW_POSITION;
}

class WindowAppPropertyDialog extends React.PureComponent<IProps, IState> {
  item: any = {};
  sizeInfo: string = '';

  constructor(props: IProps) {
    super(props);
    this.props.getRef.current = this;
  }

  open = (item: any) => {
    const { langData } = this.props;

    this.item = item;
    this.setState({ isOpen: true });

    switch (this.item.wsize) {
      case FGM_WINDOW_SIZE.BASED_ON_CLIENT_AREA: {
        this.sizeInfo = langData.wsizeBasedOnClientArea;
        break;
      }

      case FGM_WINDOW_SIZE.BASED_ON_WINDOW_AREA: {
        this.sizeInfo = langData.wsizeBasedOnWindowArea;
        break;
      }

      case FGM_WINDOW_SIZE.FULL_SCREEN_SIZE: {
        this.sizeInfo = langData.wsizeFullScreen;
        break;
      }

      case FGM_WINDOW_SIZE.CUSTOM_SIZE: {
        this.sizeInfo = `${langData.wsizeCustom} (${langData.width}:${this.item.width}, ${
          langData.height
        }:${this.item.height})`;
        break;
      }
    }
  };

  private handleClose = () => {
    this.setState({ isOpen: false });
  };

  private handleOK = () => {
    this.setState({ isOpen: false });
    if (this.props.onOK) {
      this.props.onOK!();
    }
  };

  render() {
    Logger.logRenderInfo(this);
    const { langData } = this.props;
    const { processPath, title, wpos } = this.item;

    return (
      <Dialog
        className={`bp3-dark  ${styles.dialog}`}
        title={langData.title}
        icon='properties'
        {...this.state}
        onClose={this.handleClose}
      >
        <div className={Classes.DIALOG_BODY}>
          <div className={styles.container}>
            <p className={styles.name}>{langData.process}</p>
            <p className={styles.desc}>{processPath}</p>
          </div>

          <div className={styles.container}>
            <p className={styles.name}>{langData.windowTitle}</p>
            <p className={styles.desc}>{title}</p>
          </div>

          <div className={styles.container}>
            <p className={styles.name}>{langData.windowPositionMode}</p>
            <WPosViewer wpos={wpos} />
          </div>

          <div className={styles.container}>
            <p className={styles.name}>{langData.windowSizeMode}</p>
            <p className={styles.desc}>{this.sizeInfo}</p>
          </div>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button
              className='dialogButtonPadding'
              onClick={this.handleOK}
              intent='primary'
              text={langData.buttonOK}
            />
          </div>
        </div>
      </Dialog>
    );
  }
}

const mapStateToProps = (state: IAppState, ownProps?: any) => {
  Logger.log('WindowAppPropertyDialog-mapStateToProps, state=', state, ', ownProps=', ownProps);

  const localeName = getLocaleNameFromLanguage(state.currentLanguage);
  const langData: any = require(`./languages/${localeName}.json`);
  return {
    langData: langData
  };
};

export default connect(mapStateToProps)(WindowAppPropertyDialog);
