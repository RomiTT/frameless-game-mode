import React from 'react';
import { Dialog, IconName } from '@blueprintjs/core/lib/esm/components';
import { MaybeElement } from '@blueprintjs/core/lib/esm/common';
import { IStoreFGM } from '../../stores/StoreFGM';
import { inject } from 'mobx-react';
import { FGM_WINDOW_POSITION, FGM_WINDOW_SIZE } from '../FGM';
import SelectAppPage from './SelectAppPage';
import SetPositionPage from './SetPositionPage';
import SetSizePage from './SetSizePage';
import styles from './AddAppDialog.module.scss';

interface AddAppDialogProps {
  storeFGM?: IStoreFGM;
  onOK: (
    item: any,
    wpos: FGM_WINDOW_POSITION,
    wsize: FGM_WINDOW_SIZE,
    width: number,
    height: number
  ) => void;
}

@inject('storeFGM')
export default class AddAppDialog extends React.Component<
  AddAppDialogProps,
  any
> {
  selectedItem: any;
  wpos = FGM_WINDOW_POSITION.MIDDLE_CENTER;
  wsize = FGM_WINDOW_SIZE.BASED_ON_CLIENT_AREA;
  width = 0;
  height = 0;

  constructor(props: AddAppDialogProps) {
    super(props);
    this.state = {
      listApp: new Array<object>(),
      stage: 1
    };
  }

  open = () => {
    this.props.storeFGM!.getWindowAppList((list: Array<object>) => {
      this.setState({ isOpen: true, stage: 1, listApp: list });
    });
  };

  handleClose = () => this.setState({ isOpen: false });

  handleOK = () => {
    this.setState({ isOpen: false });
    this.props.onOK(
      this.selectedItem,
      this.wpos,
      this.wsize,
      this.width,
      this.height
    );
  };

  handleRefreshList = () => {
    this.props.storeFGM!.getWindowAppList((list: Array<object>) => {
      this.setState({ listApp: list });
    });
  };

  render() {
    let title = 'Select a application';
    let icon: IconName | MaybeElement = 'list';
    let page = (
      <SelectAppPage
        listApp={this.state.listApp}
        onNext={(selectedItem: any) => {
          this.selectedItem = selectedItem;
          this.setState({ stage: 2 });
        }}
        onCancel={this.handleClose}
        onRefreshList={this.handleRefreshList}
      />
    );
    if (this.state.stage === 2) {
      title = 'Set position';
      icon = 'page-layout';
      page = (
        <SetPositionPage
          onPrev={() => {
            this.setState({ stage: 1 });
          }}
          onNext={(wsize: FGM_WINDOW_POSITION) => {
            this.wpos = wsize;
            this.setState({ stage: 3 });
          }}
          onCancel={this.handleClose}
        />
      );
    } else if (this.state.stage === 3) {
      title = 'Set size';
      icon = 'page-layout';
      page = (
        <SetSizePage
          onPrev={() => {
            this.setState({ stage: 2 });
          }}
          onCancel={this.handleClose}
          onOK={(wsize: FGM_WINDOW_SIZE, width: number, height: number) => {
            this.wsize = wsize;
            if (wsize === FGM_WINDOW_SIZE.CUSTOM_SIZE) {
              this.width = width;
              this.height = height;
            } else {
              this.width = 0;
              this.height = 0;
            }

            this.handleOK();
          }}
        />
      );
    }

    return (
      <Dialog
        className={`bp3-dark ${styles.dialogMain}`}
        canOutsideClickClose={false}
        onClose={this.handleClose}
        title={title}
        icon={icon}
        {...this.state}
      >
        {page}
      </Dialog>
    );
  }
}
