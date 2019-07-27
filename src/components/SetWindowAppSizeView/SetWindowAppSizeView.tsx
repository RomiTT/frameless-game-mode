import React from 'react';
import { NumericInput, Radio, RadioGroup } from '@blueprintjs/core/lib/esm/components';
import { FGM_WINDOW_SIZE } from '../../lib/FGM';
import Logger from '../../lib/Logger';
import styles from './SetWindowAppSizeView.module.scss';
import { IAppState } from '../../store/Types';
import { getLocaleNameFromLanguage } from '../../lib/lang';
import { connect } from 'react-redux';

interface IProps {
  langData: any;
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
    wsize: FGM_WINDOW_SIZE.BASED_ON_CLIENT_AREA,
    width: window.screen.width,
    height: window.screen.height
  };

  componentDidMount() {
    if (this.props.wsize !== undefined) this.setState({ wsize: this.props.wsize! });
    if (this.props.width !== undefined) this.setState({ width: this.props.width! });
    if (this.props.height !== undefined) this.setState({ height: this.props.height! });
  }

  private onWSizeChanged = (e: React.FormEvent<HTMLInputElement>) => {
    const target: any = e.target;
    const wsize = Number(target.value);
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
    const { langData } = this.props;

    return (
      <div className={styles.rootView}>
        <RadioGroup onChange={this.onWSizeChanged} selectedValue={this.state.wsize}>
          <Radio
            className={styles.radioItem}
            label={langData.wsizeBasedOnClientArea}
            value={FGM_WINDOW_SIZE.BASED_ON_CLIENT_AREA}
          />
          <Radio
            className={styles.radioItem}
            label={langData.wsizeBasedOnWindowArea}
            value={FGM_WINDOW_SIZE.BASED_ON_WINDOW_AREA}
          />
          <Radio
            className={styles.radioItem}
            label={langData.wsizeFullScreen}
            value={FGM_WINDOW_SIZE.FULL_SCREEN_SIZE}
          />
          <Radio
            className={styles.radioItem}
            label={langData.wsizeCustom}
            value={FGM_WINDOW_SIZE.CUSTOM_SIZE}
          />
        </RadioGroup>
        <div className={styles.inputContainer}>
          <p className={styles.label}>{langData.width}</p>
          <NumericInput
            className={styles.input}
            fill={true}
            disabled={this.state.wsize !== FGM_WINDOW_SIZE.CUSTOM_SIZE}
            value={this.state.width}
            onValueChange={this.handleWidthChange}
          />
        </div>
        <div className={styles.inputContainer}>
          <p className={styles.label}>{langData.height}</p>
          <NumericInput
            className={styles.input}
            fill={true}
            disabled={this.state.wsize !== FGM_WINDOW_SIZE.CUSTOM_SIZE}
            value={this.state.height}
            onValueChange={this.handleHeightChange}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: IAppState, ownProps?: any) => {
  Logger.log('SetWindowAppSizeView-mapStateToProps, state=', state, ', ownProps=', ownProps);

  const localeName = getLocaleNameFromLanguage(state.currentLanguage);
  const langData: any = require(`./languages/${localeName}.json`);
  return {
    langData: langData
  };
};

export default connect(mapStateToProps)(SetWindowAppSizeView);
