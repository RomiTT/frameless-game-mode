import React from 'react';
import SelectAppPage from './SelectAppPage';
import SetPositionPage from './SetPositionPage';
import SetSizePage from './SetSizePage';
import Tasks from '../redux/Tasks';
import { Button, Dialog, IconName } from '@blueprintjs/core/lib/esm/components';
import { FGM_WINDOW_POSITION, FGM_WINDOW_SIZE } from './FGM';
import { MaybeElement } from '@blueprintjs/core/lib/esm/common';
import styles from './AddAppDialog.module.scss';

interface IAddAppDialogProps {}

interface IAddAppDialogState {
  isOpen: boolean;
  listApp: Array<object>;
  stage: number;
  disabledNextButton1: boolean;
  selectedIndex: number;
}

type onOKCallback = (
  item: any,
  wpos: FGM_WINDOW_POSITION,
  wsize: FGM_WINDOW_SIZE,
  width: number,
  height: number
) => void;

class AddAppDialog extends React.PureComponent<
  IAddAppDialogProps,
  IAddAppDialogState
> {
  private taskFGM = Tasks.FGM;
  private selectedItem: any;
  private wpos = FGM_WINDOW_POSITION.MIDDLE_CENTER;
  private wsize = FGM_WINDOW_SIZE.BASED_ON_CLIENT_AREA;
  private width = 0;
  private height = 0;
  private onOK?: onOKCallback;
  state = {
    isOpen: false,
    listApp: new Array<object>(),
    stage: 1,
    disabledNextButton1: true,
    selectedIndex: -1
  };

  open = (onOK: onOKCallback) => {
    this.onOK = onOK;
    this.taskFGM.getWindowAppList((list: Array<object>) => {
      this.setState({ isOpen: true, stage: 1, listApp: list });
    });
  };

  private handleClose = () => this.setState({ isOpen: false });

  private handleOK = () => {
    this.setState({ isOpen: false });
    if (this.onOK) {
      this.onOK(
        this.selectedItem,
        this.wpos,
        this.wsize,
        this.width,
        this.height
      );
    }
  };

  private handleRefreshList = () => {
    this.taskFGM.getWindowAppList((list: Array<object>) => {
      this.setState({ listApp: list, selectedIndex: -1 });
    });
  };

  render() {
    let title = 'Select a application';
    let icon: IconName | MaybeElement = 'list';
    let page = (
      <SelectAppPage
        listApp={this.state.listApp}
        selectedIndex={this.state.selectedIndex}
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
                this.setState({ stage: 2, selectedIndex: data.selectedIndex });
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
        className={`${styles.dialog} bp3-dark`}
        style={{ width: 450 }}
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

export default AddAppDialog;
