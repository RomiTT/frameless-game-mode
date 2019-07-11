import React from 'react';
import { FGM_WINDOW_POSITION } from './FGM';
import styles from './SetPositionPage.module.scss';
import { Classes, Divider } from '@blueprintjs/core';

interface SetPositionPageProps {
  renderButtons: (pageInstance: SetPositionPage) => JSX.Element;
}

export default class SetPositionPage extends React.Component<
  SetPositionPageProps
> {
  state = {
    wposSelected: FGM_WINDOW_POSITION.MIDDLE_CENTER
  };

  handleSelectChange = (wpos: FGM_WINDOW_POSITION) => {
    this.setState({ wposSelected: wpos });
  };

  getClassName = (wpos: FGM_WINDOW_POSITION) => {
    return this.state.wposSelected === wpos
      ? styles.wposItemSelected
      : styles.wposItem;
  };

  getData = () => {
    return this.state.wposSelected;
  };

  render() {
    return (
      <>
        <div className={`${Classes.DIALOG_BODY} ${styles.wposRoot}`}>
          <p>Set position</p>
          <br />
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
