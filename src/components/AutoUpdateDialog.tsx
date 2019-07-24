import React from 'react';
import Logger from '../lib/Logger';
import AutoUpdater from '../lib/AutoUpdater';
import { AppToaster } from '../lib/Toaster';
import styles from './AutoUpdateDialog.module.scss';

interface IProps {}

interface IState {
  isOpen: boolean;
}

class AutoUpdateDialog extends React.PureComponent<IProps, IState> {
  open = () => {
    AutoUpdater.onDownloadProgress(this.handleDownloadProgress);
    AutoUpdater.onUpdateDownloaded(this.handleUpdateDownloaded);
    AutoUpdater.onError(this.handleUpdateError);
    AutoUpdater.downloadUpdate();
    this.setState({ isOpen: true });
  };

  private handleClose = () => {
    AutoUpdater.removeDownloadProgressListener(this.handleDownloadProgress);
    AutoUpdater.removeUpdateDownloadedListener(this.handleUpdateDownloaded);
    AutoUpdater.removeErrorHandler(this.handleUpdateError);
    this.setState({ isOpen: false });
  };

  private handleDownloadProgress = (event: any, arg: any) => {
    Logger.log(arg);
  };

  private handleUpdateDownloaded = (event: any, msg: string) => {
    Logger.log(msg);
    AutoUpdater.installUpdate();
  };

  private handleUpdateError = (event: any, error: any) => {
    Logger.log('Update error', error);
    AppToaster.show({
      intent: 'primary',
      icon: 'download',
      message: 'Update error'
    });
  };

  render() {
    return <div />;
  }
}

export default AutoUpdateDialog;
