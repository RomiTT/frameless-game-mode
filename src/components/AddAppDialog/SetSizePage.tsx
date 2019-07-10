import React from 'react';
import {
  Button,
  Divider,
  RadioGroup,
  Radio,
  NumericInput
} from '@blueprintjs/core/lib/esm/components';
import { Classes } from '@blueprintjs/core/lib/esm/common';
import { FGM_WINDOW_SIZE } from '../FGM';
import styles from './AddAppDialog.module.scss';

interface SetSizePageProps {
  onPrev: () => void;
  onCancel: () => void;
  onOK: (wsize: FGM_WINDOW_SIZE, width: number, height: number) => void;
}

export default class SetSizePage extends React.Component<
  SetSizePageProps,
  any
> {
  state = {
    wsize: FGM_WINDOW_SIZE.BASED_ON_CLIENT_AREA,
    width: window.screen.width,
    height: window.screen.height
  };

  handleWSizeChange = (val: FGM_WINDOW_SIZE) => {
    this.setState({ wsize: val });
  };

  handleWidthChange = (valueAsNumber: number, valueAsString: string) => {
    if (valueAsNumber > window.screen.width) {
      valueAsNumber = window.screen.width;
    }
    this.setState({ width: valueAsNumber });
  };

  handleHeightChange = (valueAsNumber: number, valueAsString: string) => {
    if (valueAsNumber > window.screen.height) {
      valueAsNumber = window.screen.height;
    }
    this.setState({ height: valueAsNumber });
  };

  handleOK = () => {
    if (this.props.onOK) {
      this.props.onOK(this.state.wsize, this.state.width, this.state.height);
    }
  };

  render() {
    return (
      <>
        <div className={`${Classes.DIALOG_BODY} ${styles.wsizeRoot}`}>
          <RadioGroup
            label='Set size'
            onChange={() => {}}
            selectedValue={this.state.wsize}
          >
            <Radio
              className={styles.radioItem}
              label='Window-Client size (excluded frame area)'
              value={FGM_WINDOW_SIZE.BASED_ON_CLIENT_AREA}
              onClick={() =>
                this.handleWSizeChange(FGM_WINDOW_SIZE.BASED_ON_CLIENT_AREA)
              }
            />
            <Radio
              className={styles.radioItem}
              label='Window size (included frame area)'
              value={FGM_WINDOW_SIZE.BASED_ON_WINDOW_AREA}
              onClick={() =>
                this.handleWSizeChange(FGM_WINDOW_SIZE.BASED_ON_WINDOW_AREA)
              }
            />
            <Radio
              className={styles.radioItem}
              label='Full-Screen size'
              value={FGM_WINDOW_SIZE.FULL_SCREEN_SIZE}
              onClick={() =>
                this.handleWSizeChange(FGM_WINDOW_SIZE.FULL_SCREEN_SIZE)
              }
            />
            <Radio
              className={styles.radioItem}
              label='Custom size'
              value={FGM_WINDOW_SIZE.CUSTOM_SIZE}
              onClick={() =>
                this.handleWSizeChange(FGM_WINDOW_SIZE.CUSTOM_SIZE)
              }
            />
          </RadioGroup>
          <br />
          <div className={styles.inputContainer}>
            <p className={styles.label}>Width: </p>
            <NumericInput
              disabled={this.state.wsize !== FGM_WINDOW_SIZE.CUSTOM_SIZE}
              value={this.state.width}
              onValueChange={this.handleWidthChange}
            />
          </div>
          <div className={styles.inputContainer}>
            <p className={styles.label}>Height: </p>
            <NumericInput
              disabled={this.state.wsize !== FGM_WINDOW_SIZE.CUSTOM_SIZE}
              value={this.state.height}
              onValueChange={this.handleHeightChange}
            />
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
              onClick={this.props.onCancel}
              className={styles.buttonPadding}
            >
              Cancel
            </Button>
            <Button
              onClick={this.handleOK}
              intent='primary'
              className={styles.buttonPadding}
            >
              OK
            </Button>
          </div>
        </div>
      </>
    );
  }
}
