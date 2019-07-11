import React from 'react';
import {
  RadioGroup,
  Radio,
  NumericInput,
  Divider
} from '@blueprintjs/core/lib/esm/components';
import { FGM_WINDOW_SIZE } from './FGM';
import styles from './SetSizePage.module.scss';
import { Classes } from '@blueprintjs/core';

interface SetSizePageProps {
  renderButtons: (pageInstance: SetSizePage) => JSX.Element;
}

export default class SetSizePage extends React.PureComponent<SetSizePageProps> {
  state = {
    wsize: FGM_WINDOW_SIZE.BASED_ON_CLIENT_AREA,
    width: window.screen.width,
    height: window.screen.height
  };

  private handleWSizeChange = (val: FGM_WINDOW_SIZE) => {
    this.setState({ wsize: val });
  };

  private handleWidthChange = (
    valueAsNumber: number,
    valueAsString: string
  ) => {
    if (valueAsNumber > window.screen.width) {
      valueAsNumber = window.screen.width;
    }
    this.setState({ width: valueAsNumber });
  };

  private handleHeightChange = (
    valueAsNumber: number,
    valueAsString: string
  ) => {
    if (valueAsNumber > window.screen.height) {
      valueAsNumber = window.screen.height;
    }
    this.setState({ height: valueAsNumber });
  };

  getData = () => {
    return {
      wsize: this.state.wsize,
      width: this.state.width,
      height: this.state.height
    };
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
            {this.props.renderButtons(this)}
          </div>
        </div>
      </>
    );
  }
}
