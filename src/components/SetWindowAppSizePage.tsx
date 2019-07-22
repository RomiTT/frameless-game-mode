import React from 'react';
import { Button } from '@blueprintjs/core/lib/esm/components';
import { FGM_WINDOW_SIZE } from '../lib/FGM';
import SetWindowAppSizeView from './SetWindowAppSizeView';
import styles from './SetWindowAppSizePage.module.scss';
import Logger from '../lib/Logger';

interface IProps {
  onPrev: () => void;
  onCancel: () => void;
  onOK: (wsize: FGM_WINDOW_SIZE, width: number, height: number) => void;
}

interface IState {}

export default class SetWindowAppSizePage extends React.PureComponent<IProps, IState> {
  wsize: FGM_WINDOW_SIZE = FGM_WINDOW_SIZE.BASED_ON_CLIENT_AREA;
  width = 0;
  height = 0;

  private handleWSizeChange = (wsize: FGM_WINDOW_SIZE) => {
    this.wsize = wsize;
  };

  private handleWidthChange = (width: number) => {
    this.width = width;
  };

  private handleHeightChange = (height: number) => {
    this.height = height;
  };

  private handleOK = () => {
    if (this.wsize !== FGM_WINDOW_SIZE.CUSTOM_SIZE) {
      this.width = 0;
      this.height = 0;
    }
    this.props.onOK(this.wsize, this.width, this.height);
  };

  private renderButtons = (
    <>
      <Button onClick={this.props.onPrev} className='dialogButtonPadding' text='Prev' />
      <Button onClick={this.handleOK} intent='primary' className='dialogButtonPadding' text='OK' />
      <Button onClick={this.props.onCancel} className='dialogButtonPadding' text='Cancel' />
    </>
  );

  render() {
    Logger.logRenderInfo(this);
    return (
      <SetWindowAppSizeView
        onWSizeChange={this.handleWSizeChange}
        onWidthChange={this.handleWidthChange}
        onHeightChange={this.handleHeightChange}
        dialogButtons={this.renderButtons}
      />
    );
  }
}
