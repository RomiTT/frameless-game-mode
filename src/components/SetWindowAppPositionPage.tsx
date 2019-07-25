import React from 'react';
import { Button, Classes } from '@blueprintjs/core';
import SetWindowAppPositionView from './SetWindowAppPositionView';
import { FGM_WINDOW_POSITION, FGM } from '../lib/FGM';
import Logger from '../lib/Logger';
import styles from './SetWindowAppPositionPage.module.scss';

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

  render() {
    Logger.logRenderInfo(this);
    return (
      <>
        <div className={`${Classes.DIALOG_BODY} ${styles.dialogBody}`}>
          <SetWindowAppPositionView onWPosChange={this.handleWPosChange} />
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button onClick={this.props.onPrev} className='dialogButtonPadding' text='Prev' />
            <Button
              onClick={this.handleNext}
              intent='primary'
              className='dialogButtonPadding'
              text='Next'
            />
            <Button onClick={this.props.onCancel} className='dialogButtonPadding' text='Cancel' />
          </div>
        </div>
      </>
    );
  }
}
