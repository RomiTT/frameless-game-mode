import React from 'react';
import { Button, Dialog } from '@blueprintjs/core/lib/esm/components';
import { Classes } from '@blueprintjs/core/lib/esm/common';
import styles from './AboutDialog.module.scss';
import Logger from '../lib/Logger';
const { remote, shell } = require('electron');

interface IProps {}

interface IState {
  isOpen: boolean;
}

class AboutDialog extends React.PureComponent {
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
