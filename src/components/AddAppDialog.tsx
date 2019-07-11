import React from 'react';
import {
  Button,
  Dialog,
  IconName,
  Divider
} from '@blueprintjs/core/lib/esm/components';
import { MaybeElement, Classes } from '@blueprintjs/core/lib/esm/common';
import { IStoreFGM } from '../stores/StoreFGM';
import { inject } from 'mobx-react';
import { FGM_WINDOW_POSITION, FGM_WINDOW_SIZE } from './FGM';
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
      stage: 1,
      disabledNextButton1: true
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
        onRefreshList={this.handleRefreshList}
        onSelectionChange={(item: any) => {
          this.setState({ disabledNextButton1: item == null });
        }}
        renderButtons={pageInstance => (
          <>
            <Button
              onClick={() => {
                this.selectedItem = pageInstance.getData();
                this.setState({ stage: 2 });
              }}
              intent='primary'
              disabled={this.state.disabledNextButton1}
              className={styles.buttonPadding}
            >
              Next
            </Button>
            <Button onClick={this.handleClose} className={styles.buttonPadding}>
              Cancel
            </Button>
          </>
        )}
      />
    );

    if (this.state.stage === 2) {
      title = 'Set position';
      icon = 'page-layout';
      page = (
        <SetPositionPage
          renderButtons={pageInstance => (
            <>
              <Button
                onClick={() => {
                  this.setState({ stage: 1 });
                }}
                className={styles.buttonPadding}
              >
                Prev
              </Button>
              <Button
                onClick={() => {
                  this.wpos = pageInstance.getData();
                  this.setState({ stage: 3 });
                }}
                intent='primary'
                className={styles.buttonPadding}
              >
                Next
              </Button>
              <Button
                onClick={this.handleClose}
                className={styles.buttonPadding}
              >
                Cancel
              </Button>
            </>
          )}
        />
      );
    } else if (this.state.stage === 3) {
      title = 'Set size';
      icon = 'page-layout';
      page = (
        <SetSizePage
          renderButtons={pageInstance => (
            <>
              <Button
                onClick={() => {
                  this.setState({ stage: 2 });
                }}
                className={styles.buttonPadding}
              >
                Prev
              </Button>
              <Button
                onClick={this.handleClose}
                className={styles.buttonPadding}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  const data = pageInstance.getData();
                  this.wsize = data.wsize;
                  if (data.wsize === FGM_WINDOW_SIZE.CUSTOM_SIZE) {
                    this.width = data.width;
                    this.height = data.height;
                  } else {
                    this.width = 0;
                    this.height = 0;
                  }

                  this.handleOK();
                }}
                intent='primary'
                className={styles.buttonPadding}
              >
                OK
              </Button>
            </>
          )}
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
