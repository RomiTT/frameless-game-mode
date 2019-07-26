import React from 'react';
import Logger from '../lib/Logger';
import AutoUpdater, { IUpdateProgressInfo } from '../lib/AutoUpdater';
import { Dialog, Button, ProgressBar } from '@blueprintjs/core/lib/esm/components';
import { Classes } from '@blueprintjs/core';
import styles from './AutoUpdateDialog.module.scss';

interface IProps {}

interface IState {
  isOpen: boolean;
  progressValue: number;
  errorOccured: boolean;
}

class AutoUpdateDialog extends React.PureComponent<IProps, IState> {
  state = {
    isOpen: false,
    progressValue: 0,
    errorOccured: false
  };

  error: any = null;

  open = () => {
    AutoUpdater.onDownloadProgress(this.handleDownloadProgress);
    AutoUpdater.onUpdateDownloaded(this.handleUpdateDownloaded);
    AutoUpdater.onError(this.handleUpdateError);
    AutoUpdater.downloadUpdate();
    this.setState({ isOpen: true, progressValue: 0 });
  };

  private handleClose = () => {
    AutoUpdater.removeDownloadProgressListener(this.handleDownloadProgress);
    AutoUpdater.removeUpdateDownloadedListener(this.handleUpdateDownloaded);
    AutoUpdater.removeErrorHandler(this.handleUpdateError);
    this.setState({ isOpen: false });
  };

  private handleDownloadProgress = (event: any, progressInfo: IUpdateProgressInfo) => {
    Logger.log(progressInfo);
    this.setState({ progressValue: progressInfo.transferred / progressInfo.total });
  };

  private handleUpdateDownloaded = (event: any, msg: string) => {
    Logger.log(msg);
    this.handleClose();
    AutoUpdater.installUpdate();
  };

  private handleUpdateError = (event: any, error: any) => {
    Logger.log('Update error', error);
    this.error = error;
    this.setState({ errorOccured: true });
  };

  private renderButton = () => {
    if (this.state.errorOccured) {
      return (
        <Button
          className='dialogButtonPadding'
          onClick={this.handleClose}
          autoFocus={true}
          text='Close'
        />
      );
    }

    return <></>;
  };

  private renderBody = () => {
    if (this.state.errorOccured) {
      if (this.error.statusCode === undefined) {
        return (
          <>
            <p className={styles.label}>{this.error}</p>
          </>
        );
      } else {
        return (
          <>
            <p className={styles.label}>Error occured.</p>
            <p className={styles.label}>
              {this.error.name} - {this.error.statusCode}
            </p>
          </>
        );
      }
    }

    return (
      <>
        <p className={styles.label}>Downloading a new update.</p>
        <ProgressBar intent='primary' value={this.state.progressValue} />
      </>
    );
  };

  render() {
    Logger.logRenderInfo(this);
    return (
      <Dialog
        className={`bp3-dark  ${styles.dialog}`}
        onClose={this.state.errorOccured ? this.handleClose : undefined}
        canOutsideClickClose={false}
        title='A new update'
        icon='info-sign'
        lazy={false}
        {...this.state}
      >
        <div className={Classes.DIALOG_BODY}>{this.renderBody()}</div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>{this.renderButton()}</div>
        </div>
      </Dialog>
    );
  }
}

export default AutoUpdateDialog;
