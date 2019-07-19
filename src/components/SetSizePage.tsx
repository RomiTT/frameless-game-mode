import React from 'react';
import { Button } from '@blueprintjs/core/lib/esm/components';
import { FGM_WINDOW_SIZE } from '../lib/FGM';
import SetSizeView from './SetSizeView';
import styles from './SetSizePage.module.scss';

interface IProps {
  onPrev: () => void;
  onCancel: () => void;
  onOK: (wsize: FGM_WINDOW_SIZE, width: number, height: number) => void;
}

interface IState {}

export default class SetSizePage extends React.PureComponent<IProps, IState> {
  render() {
    return (
      <SetSizeView
        renderButtons={(wsize: FGM_WINDOW_SIZE, width: number, height: number) => (
          <>
            <Button onClick={this.props.onPrev} className={styles.buttonPadding} text='Prev' />
            <Button onClick={this.props.onCancel} className={styles.buttonPadding}>
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
              className={styles.buttonPadding}
              text='OK'
            />
          </>
        )}
      />
    );
  }
}
