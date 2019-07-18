import React from 'react';
import SelectAppPage from './SelectAppPage';
import SetPositionPage from './SetPositionPage';
import SetSizePage from './SetSizePage';
import Tasks from '../store/Tasks';
import { Button, Dialog, IconName } from '@blueprintjs/core/lib/esm/components';
import { FGM_WINDOW_POSITION, FGM_WINDOW_SIZE } from '../lib/FGM';
import { MaybeElement } from '@blueprintjs/core/lib/esm/common';
import styles from './AddAppDialog.module.scss';
import { DISABLE } from '@blueprintjs/icons/lib/esm/generated/iconContents';

interface IAddAppDialogProps {}

interface IAddAppDialogState {
  isOpen: boolean;
  disabledNextButton1: boolean;
  pageIndex: number;
  selectedIndex: number;
  listApp: Array<object>;
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
  private wpos = FGM_WINDOW_POSITION.MIDDLE_CENTER;
  private wsize = FGM_WINDOW_SIZE.BASED_ON_CLIENT_AREA;
  private width = 0;
  private height = 0;
  private page: any;
  private title: any;
  private icon: MaybeElement | IconName;
  private onOK?: onOKCallback;

  state = {
    isOpen: false,
    disabledNextButton1: true,
    pageIndex: 1,
    selectedIndex: -1,
    listApp: new Array<object>()
  };

  open = async (onOK: onOKCallback) => {
    this.onOK = onOK;
    const list = await this.taskFGM.getWindowAppList();
    if (list) {
      this.updatePage(1);
      this.setState({
        isOpen: true,
        disabledNextButton1: true,
        pageIndex: 1,
        selectedIndex: -1,
        listApp: list
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
      this.setState({ selectedIndex: -1, disabledNextButton1: true, listApp: list });
    }
  };

  private selectAppPage = () => (
    <SelectAppPage
      listApp={this.state.listApp}
      selectedIndex={this.state.selectedIndex}
      onRefreshList={this.handleRefreshList}
      onSelectionChange={(index: number, item: any) => {
        if (index >= 0) {
          this.setState({ disabledNextButton1: item == null });
        }
      }}
      renderButtons={pageInstance => (
        <>
          <Button
            onClick={() => {
              const data = pageInstance.getData()!;
              this.selectedItem = data.selectedItemData;
              this.setState({ pageIndex: 2, selectedIndex: data.selectedIndex });
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
              this.setState({ pageIndex: 1 });
            }}
            className={styles.buttonPadding}
          >
            Prev
          </Button>
          <Button
            onClick={() => {
              this.wpos = pageInstance.getData();
              this.setState({ pageIndex: 3 });
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
              this.setState({ pageIndex: 2 });
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

  private updatePage(index: number) {
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
    this.updatePage(this.state.pageIndex);
    return (
      <Dialog
        className={`bp3-dark ${styles.dialog}`}
        canOutsideClickClose={false}
        onClose={this.handleClose}
        title={this.title}
        icon={this.icon}
        lazy={true}
        {...this.state}
      >
        {this.page}
      </Dialog>
    );
  }
}

export default AddAppDialog;
