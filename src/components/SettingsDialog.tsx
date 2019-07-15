import React from 'react';
import store from '../redux/Store';
import {
  Button,
  Classes,
  Dialog,
  Divider,
  Radio,
  RadioGroup,
  Switch
} from '@blueprintjs/core';
import { FGM_WATCH_MODE } from './FGM';
import styles from './SettingsDialog.module.scss';

interface ISettingsDialogProps {}

interface ISettingsDialogState {
  isOpen: boolean;
  autoLaunch: boolean;
  watchMode: FGM_WATCH_MODE;
}

type OnOKCallback = (launchAtLogon: boolean, watchMode: FGM_WATCH_MODE) => void;

class SettingsDialog extends React.PureComponent<
  ISettingsDialogProps,
  ISettingsDialogState
> {
  private onOK?: OnOKCallback;

  state = {
    isOpen: false,
    autoLaunch: false,
    watchMode: FGM_WATCH_MODE.ALL_WINDOWS
  };

  open = (onOK: OnOKCallback) => {
    this.onOK = onOK;
    const appState = store.getState();
    this.setState({
      isOpen: true,
      autoLaunch: appState.launchAtLogon,
      watchMode: appState.watchMode
    });
  };

  private handleClose = () => {
    this.setState({ isOpen: false });
  };

  private handleOK = () => {
    if (this.onOK) this.onOK(this.state.autoLaunch, this.state.watchMode);
    this.setState({ isOpen: false });
  };

  render() {
    return (
      <Dialog
        className={`bp3-dark  ${styles.dialog}`}
        style={{ width: 430 }}
        canOutsideClickClose={false}
        onClose={this.handleClose}
        title='Settings'
        icon='cog'
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
