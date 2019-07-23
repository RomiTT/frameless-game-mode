import React from 'react';
import { Button, Dialog } from '@blueprintjs/core/lib/esm/components';
import { Classes } from '@blueprintjs/core/lib/esm/common';
import styles from './YesNoDialog.module.scss';
import Logger from '../lib/Logger';

interface IProps {}

interface IState {
  isOpen: boolean;
  title: string;
  message: string;
}

type DialogCallback = () => void;

export default class YesNoDialog extends React.PureComponent<IProps, IState> {
  state = {
    isOpen: false,
    title: '',
    message: ''
  };
  private onYes?: DialogCallback;
  private onNo?: DialogCallback;

  open = (title: string, message: string, onYes?: DialogCallback, onNo?: DialogCallback) => {
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
    Logger.logRenderInfo(this);
    return (
      <Dialog
        className={`bp3-dark  ${styles.dialog}`}
        canOutsideClickClose={false}
        onClose={this.handleClose}
        title={this.state.title}
        icon='info-sign'
        lazy={false}
        {...this.state}
      >
        <div className={Classes.DIALOG_BODY}>
          <p>{this.state.message}</p>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button className='dialogButtonPadding' onClick={this.handleYes} intent='primary'>
              Yes
            </Button>
            <Button className='dialogButtonPadding' onClick={this.handleClose} autoFocus={true}>
              No
            </Button>
          </div>
        </div>
      </Dialog>
    );
  }
}
