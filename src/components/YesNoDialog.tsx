import React from 'react';
import { Dialog, Button, Divider } from '@blueprintjs/core/lib/esm/components';
import { Classes } from '@blueprintjs/core/lib/esm/common';
import styles from './YesNoDialog.module.scss';

export default class YesNoDialog extends React.PureComponent {
  state = {
    title: '',
    message: ''
  };
  private onYes?: () => void;
  private onNo?: () => void;

  open = (
    title: string,
    message: string,
    onYes?: () => void,
    onNo?: () => void
  ) => {
    this.onYes = onYes;
    this.onNo = onNo;
    this.setState({ isOpen: true, title: title, message: message });
  };

  private handleClose = () => {
    if (this.onNo) this.onNo();
    this.setState({ isOpen: false });
  };

  private handleYes = () => {
    if (this.onYes) this.onYes();
    this.setState({ isOpen: false });
  };

  render() {
    return (
      <Dialog
        className={`bp3-dark  ${styles.dialog}`}
        canOutsideClickClose={false}
        onClose={this.handleClose}
        title={this.state.title}
        icon='info-sign'
        {...this.state}
      >
        <div className={Classes.DIALOG_BODY}>
          <p>{this.state.message}</p>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button
              className={styles.buttonPadding}
              onClick={this.handleYes}
              intent='primary'
            >
              Yes
            </Button>
            <Button
              className={styles.buttonPadding}
              onClick={this.handleClose}
              autoFocus={true}
            >
              No
            </Button>
          </div>
        </div>
      </Dialog>
    );
  }
}
