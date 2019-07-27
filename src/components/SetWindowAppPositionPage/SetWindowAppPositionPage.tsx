import React from 'react';
import { Button, Classes } from '@blueprintjs/core';
import SetWindowAppPositionView from '../SetWindowAppPositionView/SetWindowAppPositionView';
import { FGM_WINDOW_POSITION, FGM } from '../../lib/FGM';
import Logger from '../../lib/Logger';
import styles from './SetWindowAppPositionPage.module.scss';
import { IAppState } from '../../store/Types';
import { getLocaleNameFromLanguage } from '../../lib/lang';
import { connect } from 'react-redux';

interface IProps {
  langData: any;
  onPrev: () => void;
  onNext: (wpos: FGM_WINDOW_POSITION) => void;
  onCancel: () => void;
}

interface IState {}

class SetWindowAppPositionPage extends React.PureComponent<IProps, IState> {
  wpos: FGM_WINDOW_POSITION = FGM_WINDOW_POSITION.MIDDLE_CENTER;

  private handleNext = () => {
    this.props.onNext(this.wpos);
  };

  private handleWPosChange = (wpos: FGM_WINDOW_POSITION) => {
    this.wpos = wpos;
  };

  render() {
    Logger.logRenderInfo(this);
    const { langData } = this.props;

    return (
      <>
        <div className={`${Classes.DIALOG_BODY} ${styles.dialogBody}`}>
          <SetWindowAppPositionView onWPosChange={this.handleWPosChange} />
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button
              onClick={this.props.onPrev}
              className='dialogButtonPadding'
              text={langData.buttonPrev}
            />
            <Button
              onClick={this.handleNext}
              intent='primary'
              className='dialogButtonPadding'
              text={langData.buttonNext}
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
  Logger.log('SetWindowAppPositionPage-mapStateToProps, state=', state, ', ownProps=', ownProps);

  const localeName = getLocaleNameFromLanguage(state.currentLanguage);
  const langData: any = require(`./languages/${localeName}.json`);
  return {
    langData: langData
  };
};

export default connect(mapStateToProps)(SetWindowAppPositionPage);
