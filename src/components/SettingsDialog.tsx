import React from 'react';
import {
  Radio,
  Dialog,
  Button,
  Classes,
  Divider,
  Switch,
  RadioGroup
} from '@blueprintjs/core';
import styles from './SettingsDialog.module.scss';
import { FGM_WATCH_MODE } from './FGM';
import { IStoreFGM } from '../stores/StoreFGM';
import { inject } from 'mobx-react';

interface SettingsDialogProps {
  storeFGM?: IStoreFGM;
}

@inject('storeFGM')
export default class SettingsDialog extends React.PureComponent<
  SettingsDialogProps
> {
  state = {
    autoLaunch: false,
    watchMode: FGM_WATCH_MODE.ALL_WINDOWS
  };

  private store = this.props.storeFGM;

  open = () => {
    this.setState({ isOpen: true });
  };

  private handleClose = () => {
    this.setState({ isOpen: false });
  };

  private handleOK = () => {
    this.store!.setWatchMode(this.state.watchMode);
    this.store!.setAutoLaunch(this.state.autoLaunch);
    this.store!.save();
    this.setState({ isOpen: false });
  };

  render() {
    return (
      <Dialog
        className={`bp3-dark  ${styles.dialogRoot}`}
        canOutsideClickClose={false}
        onClose={this.handleClose}
        title='Settings'
        icon='cog'
        {...this.state}
      >
        <div className={Classes.DIALOG_BODY}>
          <Switch
            checked={this.state.autoLaunch}
            label='Auto launch on system boot'
            onChange={e => {
              let newVal = !this.state.autoLaunch;
              this.setState({ autoLaunch: newVal });
            }}
          />
          <br />
          <RadioGroup
            label='Watch mode'
            onChange={v => console.log(v)}
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
