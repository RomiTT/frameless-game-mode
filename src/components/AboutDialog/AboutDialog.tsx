import React from 'react';
import { Button, Dialog, Icon } from '@blueprintjs/core/lib/esm/components';
import { Classes } from '@blueprintjs/core/lib/esm/common';
import Logger from '../../lib/Logger';
import styles from './AboutDialog.module.scss';
import { IAppState } from '../../store/Types';
import { getLocaleNameFromLanguage } from '../../lib/lang';
import { connect } from 'react-redux';

const { remote, shell, ipcRenderer } = require('electron');
const isDev = require('electron-is-dev');

interface IProps {
  langData: any;
  getRef: any;
}

interface IState {
  isOpen: boolean;
}

class AboutDialog extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.props.getRef.current = this;
  }

  private handleClose = () => {
    this.setState({ isOpen: false });
  };

  private handleOpenGitHub = (e: any) => {
    shell.openExternal(e.target.href);
    e.preventDefault();
  };

  open = () => {
    this.setState({ isOpen: true });
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
        icon={<Icon icon='info-sign' />}
        lazy={false}
        {...this.state}
      >
        <div className={Classes.DIALOG_BODY}>
          <div className={styles.container}>
            <p className={styles.label}>{langData.version}</p>
            <p className={styles.version}>{remote.app.getVersion()}</p>
          </div>
          <div className={styles.container}>
            <p className={styles.label}>{langData.github}</p>
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
              text={langData.buttonOK}
            />
          </div>
        </div>
      </Dialog>
    );
  }
}

const mapStateToProps = (state: IAppState, ownProps?: any) => {
  Logger.log('AboutDialog-mapStateToProps, state=', state, ', ownProps=', ownProps);

  const localeName = getLocaleNameFromLanguage(state.currentLanguage);
  const langData: any = require(`./languages/${localeName}.json`);
  return {
    langData: langData
  };
};

export default connect(mapStateToProps)(AboutDialog);
