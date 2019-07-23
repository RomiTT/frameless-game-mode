import React from 'react';
import { Button, Dialog } from '@blueprintjs/core/lib/esm/components';
import { Classes } from '@blueprintjs/core/lib/esm/common';
import styles from './AboutDialog.module.scss';
import Logger from '../lib/Logger';
const { remote } = require('electron');

interface IProps {}

interface IState {
  isOpen: boolean;
}

class AboutDialog extends React.PureComponent {
  private handleClose = () => {
    this.setState({ isOpen: false });
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
        title='About'
        icon='info-sign'
        lazy={false}
        {...this.state}
      >
        <div className={Classes.DIALOG_BODY}>
          <p>Frameless Game Mode</p>
          <p>Version: {remote.app.getVersion()}</p>
          <p>Author: Bowgum.kim</p>
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
