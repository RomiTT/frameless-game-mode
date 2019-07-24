import React from 'react';
import { Button, Dialog } from '@blueprintjs/core/lib/esm/components';
import { Classes } from '@blueprintjs/core/lib/esm/common';
import Logger from '../lib/Logger';
import YesNoDialog from './YesNoDialog';
import styles from './AboutDialog.module.scss';

const { remote, shell, ipcRenderer } = require('electron');
const isDev = require('electron-is-dev');

interface IProps {
  yesNoDialog: React.RefObject<YesNoDialog>;
}

interface IState {
  isOpen: boolean;
}

class AboutDialog extends React.PureComponent<IProps, IState> {
  private onConfirmUpdate?: () => void;
  private updateIsInProgress = false;

  private handleClose = () => {
    if (this.updateIsInProgress === false) this.setState({ isOpen: false });
  };

  private handleOpenGitHub = (e: any) => {
    shell.openExternal(e.target.href);
    e.preventDefault();
  };

  private handleUpdateAvailable = (event: any, msg: string) => {
    Logger.log(msg);
    this.props.yesNoDialog.current!.open(
      'Update available',
      'A new update is available. Do you want to install?',
      () => {
        this.updateIsInProgress = true;
        ipcRenderer.send('download-update');
      }
    );
  };

  private handleUpdateNotAvailable = (event: any, msg: string) => {
    Logger.log(msg);
  };

  private handleDownloadProgress = (event: any, arg: any) => {
    Logger.log(arg);
  };

  private handleUpdateDownloaded = (event: any, msg: string) => {
    Logger.log(msg);
    this.updateIsInProgress = false;
  };

  private handleUpdateError = (event: any, error: any) => {
    Logger.log('Update error', error);
    this.updateIsInProgress = false;
  };

  open = () => {
    this.setState({ isOpen: true });
    ipcRenderer.send('check-update');
  };

  componentDidMount() {
    ipcRenderer.on('update-available', this.handleUpdateAvailable);
    ipcRenderer.on('update-not-available', this.handleUpdateNotAvailable);
    ipcRenderer.on('download-progress', this.handleDownloadProgress);
    ipcRenderer.on('update-downloaded', this.handleUpdateDownloaded);
    ipcRenderer.on('update-error', this.handleUpdateError);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('update-available', this.handleUpdateAvailable);
    ipcRenderer.removeListener('update-not-available', this.handleUpdateNotAvailable);
    ipcRenderer.removeListener('download-progress', this.handleDownloadProgress);
    ipcRenderer.removeListener('update-downloaded', this.handleUpdateDownloaded);
    ipcRenderer.removeListener('update-error', this.handleUpdateError);
  }

  render() {
    Logger.logRenderInfo(this);
    return (
      <Dialog
        className={`bp3-dark  ${styles.dialog}`}
        canOutsideClickClose={false}
        onClose={this.handleClose}
        title='Frameless Game Mode'
        icon='info-sign'
        lazy={false}
        {...this.state}
      >
        <div className={Classes.DIALOG_BODY}>
          <div className={styles.container}>
            <p className={styles.label}>Version:</p>
            <p className={styles.desc}>{remote.app.getVersion()}</p>
          </div>
          <div className={styles.container}>
            <p className={styles.label}>GitHub:</p>
            <a
              className={styles.desc}
              href='https://github.com/RomiTT/frameless-game-mode'
              target='_blank'
              onClick={this.handleOpenGitHub}
            >
              https://github.com/RomiTT/frameless-game-mode
            </a>
          </div>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button
              className='dialogButtonPadding'
              onClick={this.handleClose}
              autoFocus={true}
              text='OK'
            />
          </div>
        </div>
      </Dialog>
    );
  }
}

export default AboutDialog;
