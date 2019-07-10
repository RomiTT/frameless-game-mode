import React from 'react';
import {
  Dialog,
  Tooltip,
  Button,
  AnchorButton,
  Divider
} from '@blueprintjs/core/lib/esm/components';
import { Classes, Intent } from '@blueprintjs/core/lib/esm/common';
import WindowAppList from './WindowAppList';
import { IStoreFGM } from '../stores/StoreFGM';
import { inject } from 'mobx-react';
import { FGM_WINDOW_POSITION, FGM_WINDOW_SIZE } from './FGM';

class SelectAppPage extends React.Component<any, any> {
  listRef: React.RefObject<WindowAppList> = React.createRef();
  state = {
    disabledNextButton: true
  };

  handleNext = () => {
    if (this.listRef.current) {
      this.props.handleNext(this.listRef.current.getSelectedItem());
    }
  };

  handleSelectionChange = (item: any) => {
    this.setState({ disabledNextButton: item == null });
  };

  render() {
    return (
      <>
        <div className={Classes.DIALOG_BODY}>
          <WindowAppList
            ref={this.listRef}
            listApp={this.props.listApp}
            style={{ height: '350px', border: 'solid 1px gray' }}
            onSelectionChange={this.handleSelectionChange}
          />
        </div>
        <Divider />
        <div className={Classes.DIALOG_FOOTER} style={{ paddingTop: '10px' }}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button
              onClick={this.handleNext}
              intent='primary'
              disabled={this.state.disabledNextButton}
            >
              Next
            </Button>
            <Button onClick={this.props.handleClose}>Cancel</Button>
          </div>
        </div>
      </>
    );
  }
}

class SetPositionAndSizePage extends React.Component<any, any> {
  render() {
    return (
      <>
        <div className={Classes.DIALOG_BODY}>
          <div>
            <h1>Stage2</h1>
          </div>
        </div>
        <Divider />
        <div className={Classes.DIALOG_FOOTER} style={{ paddingTop: '10px' }}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button onClick={this.props.handlePrev}>Prev</Button>
            <Button onClick={this.props.handleOK} intent='primary'>
              OK
            </Button>
          </div>
        </div>
      </>
    );
  }
}

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
  handleNext = (selectedItem: any) => {
    this.selectedItem = selectedItem;
    this.setState({ stage: 2 });
  };
  handlePrev = () => {
    this.setState({ stage: 1 });
  };
  handleOK = () => {
    this.setState({ isOpen: false });
    this.props.onOK(
      this.selectedItem,
      FGM_WINDOW_POSITION.MIDDLE_CENTER,
      FGM_WINDOW_SIZE.BASED_ON_CLIENT_AREA,
      0,
      0
    );
  };

  render() {
    let title = 'Select a application';
    let page = (
      <SelectAppPage
        listApp={this.state.listApp}
        handleNext={this.handleNext}
        handleClose={this.handleClose}
      />
    );
    if (this.state.stage == 2) {
      title = 'Set position and size';
      page = (
        <SetPositionAndSizePage
          handlePrev={this.handlePrev}
          handleOK={this.handleOK}
        />
      );
    }

    return (
      <Dialog
        className='bp3-dark'
        canOutsideClickClose={false}
        onClose={this.handleClose}
        title={title}
        style={{ width: '450px', height: '500px' }}
        {...this.state}
      >
        {page}
      </Dialog>
    );
  }
}
