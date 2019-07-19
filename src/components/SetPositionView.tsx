import React from 'react';
import { Classes, Divider } from '@blueprintjs/core';
import { FGM_WINDOW_POSITION } from '../lib/FGM';
import styles from './SetPositionView.module.scss';

interface IProps {
  renderButtons: (wpos: FGM_WINDOW_POSITION) => JSX.Element;
}

interface IState {
  selectedItem: FGM_WINDOW_POSITION;
}

class SetPositionView extends React.PureComponent<IProps, IState> {
  state = {
    selectedItem: FGM_WINDOW_POSITION.MIDDLE_CENTER
  };

  private handleSelectChange = (wpos: FGM_WINDOW_POSITION) => {
    this.setState({ selectedItem: wpos });
  };

  private getClassName = (wpos: FGM_WINDOW_POSITION) => {
    return this.state.selectedItem === wpos ? styles.itemSelected : styles.item;
  };

  render() {
    return (
      <>
        <div className={`${Classes.DIALOG_BODY} ${styles.rootView}`}>
          <br />
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
        <Divider className={styles.divider} />
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            {this.props.renderButtons(this.state.selectedItem)}
          </div>
        </div>
      </>
    );
  }
}

export default SetPositionView;
