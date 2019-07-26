import React from 'react';
import { Dialog } from '@blueprintjs/core/lib/esm/components/dialog/dialog';
import Logger from '../../lib/Logger';
import { FGM_WINDOW_POSITION, FGM_WINDOW_SIZE } from '../../lib/FGM';
import { Button, Classes, Tabs, Tab } from '@blueprintjs/core';
import SetWindowAppPositionView from '../SetWindowAppPositionView/SetWindowAppPositionView';
import SetWindowAppSizeView from '../SetWindowAppSizeView/SetWindowAppSizeView';
import styles from './EditWindowAppDialog.module.scss';

interface IProps {}

interface IState {
  isOpen: boolean;
}

type DialogOKCallback = (item: any) => void;

class EditWindowAppDialog extends React.PureComponent<IProps, IState> {
  private itemOriginal: any = null;
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
    this.forceUpdate();
  };

  private handleWSizeChange = (wsize: FGM_WINDOW_SIZE) => {
    this.item.wsize = wsize;
    this.forceUpdate();
  };

  private handleWidthChange = (width: number) => {
    this.item.width = width;
    this.forceUpdate();
  };

  private handleHeightChange = (height: number) => {
    this.item.height = height;
    this.forceUpdate();
  };

  private reset = () => {
    this.editPositionPanel = (
      <SetWindowAppPositionView
        wpos={this.item.wpos}
        onWPosChange={this.handleWPosChange}
        style={{ height: 240 }}
      />
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

  private isChanged = (): boolean => {
    if (this.itemOriginal === null) {
      return false;
    }

    return (
      this.item.wpos !== this.itemOriginal.wpos ||
      this.item.wsize !== this.itemOriginal.wsize ||
      this.item.width !== this.itemOriginal.width ||
      this.item.height !== this.itemOriginal.height
    );
  };

  open = (item: any, onOK: DialogOKCallback) => {
    this.itemOriginal = item;
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
        <div className={`${Classes.DIALOG_BODY} ${styles.dialogBody}`}>
          <Tabs>
            <Tab id='wpos' title='Position' panel={this.editPositionPanel} />
            <Tab id='wsize' title='Size' panel={this.editSizePanel} />
          </Tabs>
          <p className={styles.notify}>These changes will be applied from the next launch.</p>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button
              className='dialogButtonPadding'
              onClick={this.handleOK}
              intent='primary'
              text='OK'
              disabled={!this.isChanged()}
            />
            <Button onClick={this.handleClose} className='dialogButtonPadding' text='Cancel' />
          </div>
        </div>
      </Dialog>
    );
  }
}

export default EditWindowAppDialog;
