import React from 'react';
import store from '../../store/Store';
import { Button, Classes, Dialog, Divider, Radio, RadioGroup, Switch } from '@blueprintjs/core';
import { FGM_WATCH_MODE } from '../../lib/FGM';
import Logger from '../../lib/Logger';
import styles from './SettingsDialog.module.scss';
import LanguageSelect, { CallbackItemSelect } from '../LanguageSelect/LanguageSelect';
import {
  Language,
  getDefaultLanguage,
  getLanguageName,
  getLocaleNameFromLanguage
} from '../../lib/lang';
import { IAppState } from '../../store/Types';
import { connect } from 'react-redux';

interface IProps {
  langData: any;
  getRef: any;
}

interface IState {
  isOpen: boolean;
  autoLaunch: boolean;
  watchMode: FGM_WATCH_MODE;
  closeToTray: boolean;
  language: Language;
}

type OnOKCallback = (
  launchAtLogon: boolean,
  watchMode: FGM_WATCH_MODE,
  closeToTray: boolean,
  language: Language
) => void;

class SettingsDialog extends React.PureComponent<IProps, IState> {
  private onOK?: OnOKCallback;

  constructor(props: IProps) {
    super(props);
    this.props.getRef.current = this;
  }

  state = {
    isOpen: false,
    autoLaunch: false,
    watchMode: FGM_WATCH_MODE.ALL_WINDOWS,
    closeToTray: false,
    language: getDefaultLanguage()
  };

  open = (onOK: OnOKCallback) => {
    this.onOK = onOK;
    const appState = store.getState();
    this.setState({
      isOpen: true,
      autoLaunch: appState.launchAtLogon,
      watchMode: appState.watchMode,
      closeToTray: appState.closeToTray,
      language: appState.currentLanguage
    });
  };

  private isDisabledOKButton = (): boolean => {
    const appState = store.getState();
    if (
      this.state.autoLaunch === appState.launchAtLogon &&
      this.state.watchMode === appState.watchMode &&
      this.state.closeToTray === appState.closeToTray &&
      this.state.language === appState.currentLanguage
    ) {
      return true;
    }

    return false;
  };

  private handleClose = () => {
    this.setState({ isOpen: false });
  };

  private handleOK = () => {
    this.onOK!(
      this.state.autoLaunch,
      this.state.watchMode,
      this.state.closeToTray,
      this.state.language
    );
    this.setState({ isOpen: false });
  };

  private onChangeFromLaunchAtLogon = () => {
    let newVal = !this.state.autoLaunch;
    this.setState({ autoLaunch: newVal });
  };

  private onChangeFromCloseToTray = () => {
    let newVal = !this.state.closeToTray;
    this.setState({ closeToTray: newVal });
  };

  private onChangeFromWatchMoe = (e: React.FormEvent<HTMLInputElement>) => {
    const target: any = e.target;
    this.setState({ watchMode: Number(target.value) });
  };

  private onLanguageItemSelect: CallbackItemSelect = (item, event) => {
    this.setState({ language: item });
  };

  render() {
    Logger.logRenderInfo(this);
    const { langData } = this.props;

    return (
      <Dialog
        className={`bp3-dark  ${styles.dialog}`}
        canOutsideClickClose={false}
        onClose={this.handleClose}
        title={langData.title}
        icon='cog'
        lazy={false}
        {...this.state}
      >
        <div className={Classes.DIALOG_BODY}>
          <Switch
            className={styles.label}
            checked={this.state.autoLaunch}
            label={langData.launchAtLogon}
            onChange={this.onChangeFromLaunchAtLogon}
          />
          <Switch
            className={styles.label}
            checked={this.state.closeToTray}
            label={langData.closeToTray}
            onChange={this.onChangeFromCloseToTray}
          />
          <br />
          <RadioGroup
            className={styles.label}
            label={langData.watchMode}
            onChange={this.onChangeFromWatchMoe}
            selectedValue={this.state.watchMode}
          >
            <Radio
              className={styles.label}
              label={langData.allWindows}
              value={FGM_WATCH_MODE.ALL_WINDOWS}
            />
            <Radio
              className={styles.label}
              label={langData.onlyForegroundWindow}
              value={FGM_WATCH_MODE.ONLY_FOR_FOREGROUND_WINDOW}
            />
          </RadioGroup>
          <br />
          <div className={styles.container}>
            <p className={styles.label}>{langData.languages}</p>
            <LanguageSelect
              onItemSelect={this.onLanguageItemSelect}
              initialItem={this.state.language}
            />
          </div>
        </div>
        <Divider className={styles.divider} />
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button
              className='dialogButtonPadding'
              onClick={this.handleOK}
              intent='primary'
              disabled={this.isDisabledOKButton()}
              text={langData.buttonOK}
            />
            <Button
              className='dialogButtonPadding'
              onClick={this.handleClose}
              autoFocus={true}
              text={langData.buttonCancel}
            />
          </div>
        </div>
      </Dialog>
    );
  }
}

const mapStateToProps = (state: IAppState, ownProps?: any) => {
  Logger.log('SettingsDialog-mapStateToProps, state=', state, ', ownProps=', ownProps);

  const localeName = getLocaleNameFromLanguage(state.currentLanguage);
  const langData: any = require(`./languages/${localeName}.json`);
  return {
    langData: langData
  };
};

export default connect(mapStateToProps)(SettingsDialog);
