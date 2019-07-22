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
  render() {
    Logger.logRenderInfo(this);
    return (
      <SetWindowAppSizeView
        renderButtons={(wsize: FGM_WINDOW_SIZE, width: number, height: number) => (
          <>
            <Button onClick={this.props.onPrev} className='dialogButtonPadding' text='Prev' />
            <Button onClick={this.props.onCancel} className='dialogButtonPadding'>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (wsize !== FGM_WINDOW_SIZE.CUSTOM_SIZE) {
                  width = 0;
                  height = 0;
                }
                this.props.onOK(wsize, width, height);
              }}
              intent='primary'
              className='dialogButtonPadding'
              text='OK'
            />
          </>
        )}
      />
    );
  }
}
