import React from 'react';
import store from '../store/Store';
import {
  Button,
  Classes,
  Dialog,
  Divider,
  Radio,
  RadioGroup,
  Switch
} from '@blueprintjs/core';
import { FGM_WATCH_MODE } from '../lib/FGM';
import styles from './SettingsDialog.module.scss';

interface ISettingsDialogProps {}

interface ISettingsDialogState {
  isOpen: boolean;
  autoLaunch: boolean;
  watchMode: FGM_WATCH_MODE;
  closeToTray: boolean;
}

type OnOKCallback = (
  launchAtLogon: boolean,
  watchMode: FGM_WATCH_MODE,
  closeToTray: boolean
) => void;

class SettingsDialog extends React.PureComponent<
  ISettingsDialogProps,
  ISettingsDialogState
> {
  private onOK?: OnOKCallback;

  state = {
    isOpen: false,
    autoLaunch: false,
    watchMode: FGM_WATCH_MODE.ALL_WINDOWS,
    closeToTray: false
  };

  open = (onOK: OnOKCallback) => {
    this.onOK = onOK;
    const appState = store.getState();
    this.setState({
      isOpen: true,
      autoLaunch: appState.launchAtLogon,
      watchMode: appState.watchMode,
      closeToTray: appState.closeToTray
    });
  };

  private handleClose = () => {
    this.setState({ isOpen: false });
  };

  private handleOK = () => {
    if (this.onOK)
      this.onOK(
        this.state.autoLaunch,
        this.state.watchMode,
        this.state.closeToTray
      );
    this.setState({ isOpen: false });
  };

  render() {
    return (
      <Dialog
        className={`bp3-dark  ${styles.dialog}`}
        canOutsideClickClose={false}
        onClose={this.handleClose}
        title='Settings'
        icon='cog'
        lazy={false}
        {...this.state}
      >
        <div className={Classes.DIALOG_BODY}>
          <Switch
            checked={this.state.autoLaunch}
            label='Launch at login'
            onChange={e => {
              let newVal = !this.state.autoLaunch;
              this.setState({ autoLaunch: newVal });
            }}
          />
          <Switch
            checked={this.state.closeToTray}
            label='Close to tray'
            onChange={e => {
              let newVal = !this.state.closeToTray;
              this.setState({ closeToTray: newVal });
            }}
          />
          <br />
          <RadioGroup
            label='Watch mode'
            onChange={() => {}}
            selectedValue={this.state.watchMode}
          >
            <Radio
              label='All windows'
              value={FGM_WATCH_MODE.ALL_WINDOWS}
              onClick={() => {
                this.setState({ watchMode: FGM_WATCH_MODE.ALL_WINDOWS });
              }}
            />
            <Radio
              label='Only the foreground window'
              value={FGM_WATCH_MODE.ONLY_FOR_FOREGROUND_WINDOW}
              onClick={() => {
                this.setState({
                  watchMode: FGM_WATCH_MODE.ONLY_FOR_FOREGROUND_WINDOW
                });
              }}
            />
          </RadioGroup>
        </div>
        <Divider className={styles.divider} />
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button
              className={styles.buttonPadding}
              onClick={this.handleOK}
              intent='primary'
            >
              OK
            </Button>
            <Button
              className={styles.buttonPadding}
              onClick={this.handleClose}
              autoFocus={true}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Dialog>
    );
  }
}

export default SettingsDialog;
