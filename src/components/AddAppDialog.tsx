import React from 'react';
import SelectAppPage from './SelectAppPage';
import SetPositionPage from './SetPositionPage';
import SetSizePage from './SetSizePage';
import Tasks from '../store/Tasks';
import { Button, Dialog, IconName } from '@blueprintjs/core/lib/esm/components';
import { FGM_WINDOW_POSITION, FGM_WINDOW_SIZE } from '../lib/FGM';
import { MaybeElement } from '@blueprintjs/core/lib/esm/common';
import styles from './AddAppDialog.module.scss';

interface IAddAppDialogProps {}

interface IAddAppDialogState {
  isOpen: boolean;
  disabledNextButton1: boolean;
}

type onOKCallback = (
  item: any,
  wpos: FGM_WINDOW_POSITION,
  wsize: FGM_WINDOW_SIZE,
  width: number,
  height: number
) => void;

class AddAppDialog extends React.PureComponent<IAddAppDialogProps, IAddAppDialogState> {
  private taskFGM = Tasks.FGM;
  private selectedItem: any;
  private selectedIndex: number = -1;
  private wpos = FGM_WINDOW_POSITION.MIDDLE_CENTER;
  private wsize = FGM_WINDOW_SIZE.BASED_ON_CLIENT_AREA;
  private width = 0;
  private height = 0;
  private listApp: any;
  private pageIndex = 1;
  private page: any;
  private title: any;
  private icon: MaybeElement | IconName;
  private onOK?: onOKCallback;

  state = {
    isOpen: false,
    disabledNextButton1: true
  };

  open = async (onOK: onOKCallback) => {
    this.onOK = onOK;
    const list = await this.taskFGM.getWindowAppList();
    if (list) {
      this.listApp = list;
      this.selectedIndex = -1;
      this.handlePageChanged(1);
      this.setState({
        isOpen: true
      });
    }
  };

  private handleClose = () => this.setState({ isOpen: false });

  private handleOK = () => {
    this.setState({ isOpen: false });
    if (this.onOK) {
      this.onOK(this.selectedItem, this.wpos, this.wsize, this.width, this.height);
    }
  };

  private handleRefreshList = async () => {
    const list = await this.taskFGM.getWindowAppList();
    if (list) {
      this.selectedIndex = -1;
      this.listApp = list;
      this.handlePageChanged(this.pageIndex);
      this.forceUpdate();
    }
  };

  private selectAppPage = () => (
    <SelectAppPage
      listApp={this.listApp}
      selectedIndex={this.selectedIndex}
      onRefreshList={this.handleRefreshList}
      onSelectionChange={(item: any) => {
        this.setState({ disabledNextButton1: item == null });
      }}
      renderButtons={pageInstance => (
        <>
          <Button
            onClick={() => {
              const data = pageInstance.getData()!;
              this.selectedItem = data.selectedItemData;
              this.selectedIndex = data.selectedIndex;
              this.handlePageChanged(2);
              this.forceUpdate();
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

  private setPositionPage = () => (
    <SetPositionPage
      renderButtons={pageInstance => (
        <>
          <Button
            onClick={() => {
              this.handlePageChanged(1);
              this.forceUpdate();
            }}
            className={styles.buttonPadding}
          >
            Prev
          </Button>
          <Button
            onClick={() => {
              this.wpos = pageInstance.getData();
              this.handlePageChanged(3);
              this.forceUpdate();
            }}
            intent='primary'
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

  private setSizePage = () => (
    <SetSizePage
      renderButtons={pageInstance => (
        <>
          <Button
            onClick={() => {
              this.handlePageChanged(2);
              this.forceUpdate();
            }}
            className={styles.buttonPadding}
          >
            Prev
          </Button>
          <Button onClick={this.handleClose} className={styles.buttonPadding}>
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

  private handlePageChanged(index: number) {
    this.pageIndex = index;
    switch (index) {
      case 1: {
        this.page = this.selectAppPage();
        this.title = 'Select a application';
        this.icon = 'list';
        break;
      }

      case 2: {
        this.page = this.setPositionPage();
        this.title = 'Set position';
        this.icon = 'page-layout';
        break;
      }

      case 3: {
        this.page = this.setSizePage();
        this.title = 'Set size';
        this.icon = 'page-layout';
        break;
      }
    }
  }

  render() {
    console.log('AddAppDialog - ', new Date().getMilliseconds());
    return (
      <Dialog
        className={`bp3-dark ${styles.dialog}`}
        canOutsideClickClose={false}
        onClose={this.handleClose}
        title={this.title}
        icon={this.icon}
        lazy={false}
        {...this.state}
      >
        {this.page}
      </Dialog>
    );
  }
}

export default AddAppDialog;
