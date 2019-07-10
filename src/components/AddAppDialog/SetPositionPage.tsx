import React from 'react';
import { Button, Divider } from '@blueprintjs/core/lib/esm/components';
import { Classes } from '@blueprintjs/core/lib/esm/common';
import { FGM_WINDOW_POSITION } from '../FGM';
import styles from './AddAppDialog.module.scss';

interface SetPositionPageProps {
  onPrev: () => void;
  onNext: (wsize: FGM_WINDOW_POSITION) => void;
  onCancel: () => void;
}

export default class SetPositionPage extends React.Component<
  SetPositionPageProps,
  any
> {
  state = {
    wsizeSelected: FGM_WINDOW_POSITION.MIDDLE_CENTER
  };

  handleSelectChange = (wpos: FGM_WINDOW_POSITION) => {
    this.setState({ wsizeSelected: wpos });
  };

  getClassName = (wsize: FGM_WINDOW_POSITION) => {
    return this.state.wsizeSelected === wsize
      ? styles.wposItemSelected
      : styles.wposItem;
  };

  handleNext = () => {
    this.props.onNext(this.state.wsizeSelected);
  };

  render() {
    return (
      <>
        <div className={Classes.DIALOG_BODY}>
          <p>Set position</p>
          <br />
          <div className={styles.wposRoot}>
            <div className={styles.wposRow}>
              <div
                className={this.getClassName(FGM_WINDOW_POSITION.LEFT_TOP)}
                onClick={() =>
                  this.handleSelectChange(FGM_WINDOW_POSITION.LEFT_TOP)
                }
              />
              <div
                className={this.getClassName(FGM_WINDOW_POSITION.MIDDLE_TOP)}
                onClick={() =>
                  this.handleSelectChange(FGM_WINDOW_POSITION.MIDDLE_TOP)
                }
              />
              <div
                className={this.getClassName(FGM_WINDOW_POSITION.RIGHT_TOP)}
                onClick={() =>
                  this.handleSelectChange(FGM_WINDOW_POSITION.RIGHT_TOP)
                }
              />
            </div>
            <div className={styles.wposRow}>
              <div
                className={this.getClassName(FGM_WINDOW_POSITION.LEFT_CENTER)}
                onClick={() =>
                  this.handleSelectChange(FGM_WINDOW_POSITION.LEFT_CENTER)
                }
              />
              <div
                className={this.getClassName(FGM_WINDOW_POSITION.MIDDLE_CENTER)}
                onClick={() =>
                  this.handleSelectChange(FGM_WINDOW_POSITION.MIDDLE_CENTER)
                }
              />
              <div
                className={this.getClassName(FGM_WINDOW_POSITION.RIGHT_CENTER)}
                onClick={() =>
                  this.handleSelectChange(FGM_WINDOW_POSITION.RIGHT_CENTER)
                }
              />
            </div>
            <div className={styles.wposRow}>
              <div
                className={this.getClassName(FGM_WINDOW_POSITION.LEFT_BOTTOM)}
                onClick={() =>
                  this.handleSelectChange(FGM_WINDOW_POSITION.LEFT_BOTTOM)
                }
              />
              <div
                className={this.getClassName(FGM_WINDOW_POSITION.MIDDLE_BOTTOM)}
                onClick={() =>
                  this.handleSelectChange(FGM_WINDOW_POSITION.MIDDLE_BOTTOM)
                }
              />
              <div
                className={this.getClassName(FGM_WINDOW_POSITION.RIGHT_BOTTOM)}
                onClick={() =>
                  this.handleSelectChange(FGM_WINDOW_POSITION.RIGHT_BOTTOM)
                }
              />
            </div>
          </div>
        </div>
        <Divider />
        <div className={Classes.DIALOG_FOOTER} style={{ paddingTop: '10px' }}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button
              onClick={this.props.onPrev}
              className={styles.buttonPadding}
            >
              Prev
            </Button>
            <Button
              onClick={this.handleNext}
              intent='primary'
              className={styles.buttonPadding}
            >
              Next
            </Button>
            <Button
              onClick={this.props.onCancel}
              className={styles.buttonPadding}
            >
              Cancel
            </Button>
          </div>
        </div>
      </>
    );
  }
}
