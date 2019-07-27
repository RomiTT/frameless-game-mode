import React from 'react';
import { Button } from '@blueprintjs/core/lib/esm/components';
import { FGM_WINDOW_SIZE } from '../../lib/FGM';
import SetWindowAppSizeView from '../SetWindowAppSizeView/SetWindowAppSizeView';
import Logger from '../../lib/Logger';
import { Classes } from '@blueprintjs/core';
import styles from './SetWindowAppSizePage.module.scss';
import { IAppState } from '../../store/Types';
import { getLocaleNameFromLanguage } from '../../lib/lang';
import { connect } from 'react-redux';

interface IProps {
  langData: any;
  onPrev: () => void;
  onCancel: () => void;
  onOK: (wsize: FGM_WINDOW_SIZE, width: number, height: number) => void;
}

interface IState {}

class SetWindowAppSizePage extends React.PureComponent<IProps, IState> {
  wsize: FGM_WINDOW_SIZE = FGM_WINDOW_SIZE.BASED_ON_CLIENT_AREA;
  width = window.screen.width;
  height = window.screen.height;

  private handleWSizeChange = (wsize: FGM_WINDOW_SIZE) => {
    this.wsize = wsize;
  };

  private handleWidthChange = (width: number) => {
    this.width = width;
  };

  private handleHeightChange = (height: number) => {
    this.height = height;
  };

  private handleOK = () => {
    if (this.wsize !== FGM_WINDOW_SIZE.CUSTOM_SIZE) {
      this.width = 0;
      this.height = 0;
    }
    this.props.onOK(this.wsize, this.width, this.height);
  };

  render() {
    Logger.logRenderInfo(this);
    const { langData } = this.props;

    return (
      <>
        <div className={`${Classes.DIALOG_BODY} ${styles.dialogBody}`}>
          <SetWindowAppSizeView
            onWSizeChange={this.handleWSizeChange}
            onWidthChange={this.handleWidthChange}
            onHeightChange={this.handleHeightChange}
          />
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button
              onClick={this.props.onPrev}
              className='dialogButtonPadding'
              text={langData.buttonPrev}
            />
            <Button
              onClick={this.handleOK}
              intent='primary'
              className='dialogButtonPadding'
              text={langData.buttonOK}
            />
            <Button
              onClick={this.props.onCancel}
              className='dialogButtonPadding'
              text={langData.buttonCancel}
            />
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state: IAppState, ownProps?: any) => {
  Logger.log('SetWindowAppSizePage-mapStateToProps, state=', state, ', ownProps=', ownProps);

  const localeName = getLocaleNameFromLanguage(state.currentLanguage);
  const langData: any = require(`./languages/${localeName}.json`);
  return {
    langData: langData
  };
};

export default connect(mapStateToProps)(SetWindowAppSizePage);
