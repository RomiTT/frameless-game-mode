import React from 'react';
import { Dialog } from '@blueprintjs/core/lib/esm/components/dialog/dialog';
import Logger from '../lib/Logger';
import { FGM_WINDOW_POSITION, FGM_WINDOW_SIZE } from '../lib/FGM';
import { Button, Classes, Tabs, Tab } from '@blueprintjs/core';
import styles from './EditWindowAppDialog.module.scss';
import SetWindowAppPositionView from './SetWindowAppPositionView';
import SetWindowAppSizeView from './SetWindowAppSizeView';
import { resetWarningCache } from 'prop-types';

interface IProps {}

interface IState {
  isOpen: boolean;
}

type DialogOKCallback = (item: any) => void;

class EditWindowAppDialog extends React.PureComponent<IProps, IState> {
  private item: any = {
    wpos: FGM_WINDOW_POSITION.MIDDLE_CENTER,
    wsize: FGM_WINDOW_SIZE.BASED_ON_CLIENT_AREA,
    width: 0,
    height: 0
  };
  private onOK?: DialogOKCallback;
  private editPositionPanel: any;
  private editSizePanel: any;

  constructor(props: IProps) {
    super(props);
    this.reset();
  }

  private handleClose = () => {
    this.setState({ isOpen: false });
  };

  private handleOK = () => {
    this.onOK!(this.item);
    this.setState({ isOpen: false });
  };

  private handleWPosChange = (wpos: FGM_WINDOW_POSITION) => {
    this.item.wpos = wpos;
  };

  private handleWSizeChange = (wsize: FGM_WINDOW_SIZE) => {
    this.item.wsize = wsize;
  };

  private handleWidthChange = (width: number) => {
    this.item.width = width;
  };

  private handleHeightChange = (height: number) => {
    this.item.height = height;
  };

  private reset = () => {
    this.editPositionPanel = (
      <SetWindowAppPositionView wpos={this.item.wpos} onWPosChange={this.handleWPosChange} />
    );

    this.editSizePanel = (
      <SetWindowAppSizeView
        wsize={this.item.wsize}
        width={this.item.width}
        height={this.item.height}
        onWSizeChange={this.handleWSizeChange}
        onWidthChange={this.handleWidthChange}
        onHeightChange={this.handleHeightChange}
      />
    );
  };

  open = (item: any, onOK: DialogOKCallback) => {
    this.item = {
      wpos: item.wpos,
      wsize: item.wsize,
      width: item.width,
      height: item.height
    };
    this.onOK = onOK;
    this.reset();
    this.setState({ isOpen: true });
  };

  render() {
    Logger.logRenderInfo(this);
    return (
      <Dialog
        className={`bp3-dark  ${styles.dialog}`}
        canOutsideClickClose={false}
        onClose={this.handleClose}
        title='Edit'
        icon='page-layout'
        lazy={false}
        {...this.state}
      >
        <div className={Classes.DIALOG_BODY}>
          <Tabs>
            <Tab id='wpos' title='Position' panel={this.editPositionPanel} />
            <Tab id='wsize' title='Size' panel={this.editSizePanel} />
          </Tabs>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button
              className='dialogButtonPadding'
              onClick={this.handleOK}
              intent='primary'
              text='OK'
            />
            <Button onClick={this.handleClose} className='dialogButtonPadding' text='Cancel' />
          </div>
        </div>
      </Dialog>
    );
  }
}

export default EditWindowAppDialog;
