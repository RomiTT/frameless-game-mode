import React from 'react';
import { Button } from '@blueprintjs/core';
import SetWindowAppPositionView from './SetWindowAppPositionView';
import { FGM_WINDOW_POSITION, FGM } from '../lib/FGM';
import styles from './SetWindowAppPositionPage.module.scss';
import Logger from '../lib/Logger';

interface IProps {
  onPrev: () => void;
  onNext: (wpos: FGM_WINDOW_POSITION) => void;
  onCancel: () => void;
}

interface IState {}

export default class SetWindowAppPositionPage extends React.PureComponent<IProps, IState> {
  wpos: FGM_WINDOW_POSITION = FGM_WINDOW_POSITION.MIDDLE_CENTER;

  private handleNext = () => {
    this.props.onNext(this.wpos);
  };

  private handleWPosChange = (wpos: FGM_WINDOW_POSITION) => {
    this.wpos = wpos;
  };

  private renderButtons = (
    <>
      <Button onClick={this.props.onPrev} className='dialogButtonPadding' text='Prev' />
      <Button
        onClick={this.handleNext}
        intent='primary'
        className='dialogButtonPadding'
        text='Next'
      />
      <Button onClick={this.props.onCancel} className='dialogButtonPadding' text='Cancel' />
    </>
  );

  render() {
    Logger.logRenderInfo(this);
    return (
      <SetWindowAppPositionView
        onWPosChange={this.handleWPosChange}
        renderButtons={this.renderButtons}
      />
    );
  }
}
