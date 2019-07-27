import React from 'react';
import Logger from '../../lib/Logger';
import AutoUpdater, { IUpdateProgressInfo } from '../../lib/AutoUpdater';
import { Dialog, Button, ProgressBar } from '@blueprintjs/core/lib/esm/components';
import { Classes } from '@blueprintjs/core';
import styles from './AutoUpdateDialog.module.scss';
import { IAppState } from '../../store/Types';
import { getLocaleNameFromLanguage } from '../../lib/lang';
import { connect } from 'react-redux';

const isDev = require('electron-is-dev');

interface IProps {
  langData: any;
  getRef: any;
}

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

  constructor(props: IProps) {
    super(props);
    this.props.getRef.current = this;
  }

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
    this.setState({ progressValue: progressInfo.percent / 100 });
  };

  private handleUpdateDownloaded = (event: any, msg: string) => {
    Logger.log(msg);
    this.handleClose();
    if (!isDev) AutoUpdater.installUpdate();
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
          text={this.props.langData.buttonClose}
        />
      );
    }

    return <></>;
  };

  private renderBody = () => {
    const { langData } = this.props;
    if (this.state.errorOccured) {
      if (this.error.statusCode === undefined) {
        return (
          <>
            <p className={styles.error}>{this.error}</p>
          </>
        );
      } else {
        return (
          <>
            <p className={styles.error}>{langData.errorLabel}</p>
            <p className={styles.error}>
              {this.error.name} - {this.error.statusCode}
            </p>
          </>
        );
      }
    }

    return (
      <>
        <p className={styles.label}>{langData.progressLabel}</p>
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
        title={this.props.langData.title}
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

const mapStateToProps = (state: IAppState, ownProps?: any) => {
  Logger.log('AutoUpdateDialog-mapStateToProps, state=', state, ', ownProps=', ownProps);

  const localeName = getLocaleNameFromLanguage(state.currentLanguage);
  const langData: any = require(`./languages/${localeName}.json`);
  return {
    langData: langData
  };
};

export default connect(mapStateToProps)(AutoUpdateDialog);
