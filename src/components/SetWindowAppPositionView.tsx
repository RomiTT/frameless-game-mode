import React from 'react';
import { FGM_WINDOW_POSITION } from '../lib/FGM';
import Logger from '../lib/Logger';
import styles from './SetWindowAppPositionView.module.scss';

interface IProps {
  style?: React.CSSProperties;
  wpos?: FGM_WINDOW_POSITION;
  onWPosChange: (wpos: FGM_WINDOW_POSITION) => void;
}

interface IState {
  wpos: FGM_WINDOW_POSITION;
}

class SetWindowAppPositionView extends React.PureComponent<IProps, IState> {
  state = {
    wpos: FGM_WINDOW_POSITION.MIDDLE_CENTER
  };

  componentDidMount() {
    if (this.props.wpos !== undefined) this.setState({ wpos: this.props.wpos! });
  }

  private handleSelectChange = (wpos: FGM_WINDOW_POSITION) => {
    this.props.onWPosChange(wpos);
    this.setState({ wpos: wpos });
  };

  private getClassName = (wpos: FGM_WINDOW_POSITION) => {
    return this.state.wpos === wpos ? styles.itemSelected : styles.item;
  };

  render() {
    Logger.logRenderInfo(this);
    return (
      <div className={styles.rootView} style={this.props.style}>
        <div className={styles.row}>
          <div
            className={this.getClassName(FGM_WINDOW_POSITION.LEFT_TOP)}
            onClick={() => this.handleSelectChange(FGM_WINDOW_POSITION.LEFT_TOP)}
          />
          <div
            className={this.getClassName(FGM_WINDOW_POSITION.MIDDLE_TOP)}
            onClick={() => this.handleSelectChange(FGM_WINDOW_POSITION.MIDDLE_TOP)}
          />
          <div
            className={this.getClassName(FGM_WINDOW_POSITION.RIGHT_TOP)}
            onClick={() => this.handleSelectChange(FGM_WINDOW_POSITION.RIGHT_TOP)}
          />
        </div>
        <div className={styles.row}>
          <div
            className={this.getClassName(FGM_WINDOW_POSITION.LEFT_CENTER)}
            onClick={() => this.handleSelectChange(FGM_WINDOW_POSITION.LEFT_CENTER)}
          />
          <div
            className={this.getClassName(FGM_WINDOW_POSITION.MIDDLE_CENTER)}
            onClick={() => this.handleSelectChange(FGM_WINDOW_POSITION.MIDDLE_CENTER)}
          />
          <div
            className={this.getClassName(FGM_WINDOW_POSITION.RIGHT_CENTER)}
            onClick={() => this.handleSelectChange(FGM_WINDOW_POSITION.RIGHT_CENTER)}
          />
        </div>
        <div className={styles.row}>
          <div
            className={this.getClassName(FGM_WINDOW_POSITION.LEFT_BOTTOM)}
            onClick={() => this.handleSelectChange(FGM_WINDOW_POSITION.LEFT_BOTTOM)}
          />
          <div
            className={this.getClassName(FGM_WINDOW_POSITION.MIDDLE_BOTTOM)}
            onClick={() => this.handleSelectChange(FGM_WINDOW_POSITION.MIDDLE_BOTTOM)}
          />
          <div
            className={this.getClassName(FGM_WINDOW_POSITION.RIGHT_BOTTOM)}
            onClick={() => this.handleSelectChange(FGM_WINDOW_POSITION.RIGHT_BOTTOM)}
          />
        </div>
      </div>
    );
  }
}

export default SetWindowAppPositionView;
