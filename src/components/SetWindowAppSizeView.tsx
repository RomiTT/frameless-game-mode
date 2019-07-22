import React from 'react';
import { Classes } from '@blueprintjs/core';
import { Divider, NumericInput, Radio, RadioGroup } from '@blueprintjs/core/lib/esm/components';
import { FGM_WINDOW_SIZE } from '../lib/FGM';
import styles from './SetWindowAppSizeView.module.scss';
import Logger from '../lib/Logger';

interface IProps {
  dialogButtons?: JSX.Element;
  wsize?: FGM_WINDOW_SIZE;
  width?: number;
  height?: number;
  onWSizeChange: (wsize: FGM_WINDOW_SIZE) => void;
  onWidthChange: (width: number) => void;
  onHeightChange: (height: number) => void;
}

interface IState {
  wsize: FGM_WINDOW_SIZE;
  width: number;
  height: number;
}

class SetWindowAppSizeView extends React.PureComponent<IProps, IState> {
  state = {
    wsize: this.props.wsize ? this.props.wsize! : FGM_WINDOW_SIZE.BASED_ON_CLIENT_AREA,
    width: this.props.width ? this.props.width! : window.screen.width,
    height: this.props.height ? this.props.height! : window.screen.height
  };

  private onWSizeChanged = (e: React.FormEvent<HTMLInputElement>) => {
    const event = e.nativeEvent as any;
    const wsize = Number(event.target.value);
    this.props.onWSizeChange(wsize);
    this.setState({ wsize: wsize });
  };

  private handleWidthChange = (valueAsNumber: number, valueAsString: string) => {
    if (valueAsNumber > window.screen.width) {
      valueAsNumber = window.screen.width;
    }
    this.props.onWidthChange(valueAsNumber);
    this.setState({ width: valueAsNumber });
  };

  private handleHeightChange = (valueAsNumber: number, valueAsString: string) => {
    if (valueAsNumber > window.screen.height) {
      valueAsNumber = window.screen.height;
    }
    this.props.onHeightChange(valueAsNumber);
    this.setState({ height: valueAsNumber });
  };

  render() {
    Logger.logRenderInfo(this);
    return (
      <>
        <div className={`${Classes.DIALOG_BODY} ${styles.rootView}`}>
          <RadioGroup onChange={this.onWSizeChanged} selectedValue={this.state.wsize}>
            <Radio
              className={styles.radioItem}
              label='Window-Client size (excluded frame area)'
              value={FGM_WINDOW_SIZE.BASED_ON_CLIENT_AREA}
            />
            <Radio
              className={styles.radioItem}
              label='Window size (included frame area)'
              value={FGM_WINDOW_SIZE.BASED_ON_WINDOW_AREA}
            />
            <Radio
              className={styles.radioItem}
              label='Full-Screen size'
              value={FGM_WINDOW_SIZE.FULL_SCREEN_SIZE}
            />
            <Radio
              className={styles.radioItem}
              label='Custom size'
              value={FGM_WINDOW_SIZE.CUSTOM_SIZE}
            />
          </RadioGroup>
          <div className={styles.inputContainer}>
            <p className={styles.label}>Width: </p>
            <NumericInput
              className={styles.input}
              fill={true}
              disabled={this.state.wsize !== FGM_WINDOW_SIZE.CUSTOM_SIZE}
              value={this.state.width}
              onValueChange={this.handleWidthChange}
            />
          </div>
          <div className={styles.inputContainer}>
            <p className={styles.label}>Height: </p>
            <NumericInput
              className={styles.input}
              fill={true}
              disabled={this.state.wsize !== FGM_WINDOW_SIZE.CUSTOM_SIZE}
              value={this.state.height}
              onValueChange={this.handleHeightChange}
            />
          </div>
        </div>
        <Divider className={styles.divider} />
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>{this.props.dialogButtons}</div>
        </div>
      </>
    );
  }
}

export default SetWindowAppSizeView;
