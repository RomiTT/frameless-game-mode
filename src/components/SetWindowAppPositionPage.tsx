import React from 'react';
import { Button } from '@blueprintjs/core';
import SetWindowAppPositionView from './SetWindowAppPositionView';
import { FGM_WINDOW_POSITION } from '../lib/FGM';
import styles from './SetWindowAppPositionPage.module.scss';
import Logger from '../lib/Logger';

interface IProps {
  onPrev: () => void;
  onNext: (wpos: FGM_WINDOW_POSITION) => void;
  onCancel: () => void;
}

interface IState {}

export default class SetWindowAppPositionPage extends React.PureComponent<IProps, IState> {
  render() {
    Logger.logRenderInfo(this);
    return (
      <SetWindowAppPositionView
        renderButtons={wpos => (
          <>
            <Button onClick={this.props.onPrev} className='dialogButtonPadding' text='Prev' />
            <Button
              onClick={() => {
                this.props.onNext(wpos);
              }}
              intent='primary'
              className='dialogButtonPadding'
              text='Next'
            />
            <Button onClick={this.props.onCancel} className='dialogButtonPadding' text='Cancel' />
          </>
        )}
      />
    );
  }
}
