import React from 'react';
import { Dialog, Button, Divider } from '@blueprintjs/core/lib/esm/components';
import { Classes } from '@blueprintjs/core/lib/esm/common';

export default class YesNoDialog extends React.Component {
  state = {
    title: '',
    message: ''
  };

  onYes?: () => void;
  onNo?: () => void;

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

  handleClose = () => {
    this.setState({ isOpen: false });
    if (this.onNo) this.onNo();
  };

  handleYes = () => {
    if (this.onYes) this.onYes();
  };

  render() {
    const buttonPadding = '30px';
    return (
      <Dialog
        className='bp3-dark'
        canOutsideClickClose={false}
        onClose={this.handleClose}
        title={this.state.title}
        icon='info-sign'
        style={{ width: '430px' }}
        {...this.state}
      >
        <div className={Classes.DIALOG_BODY}>
          <p>{this.state.message}</p>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button
              onClick={this.handleYes}
              intent='primary'
              style={{
                paddingLeft: buttonPadding,
                paddingRight: buttonPadding
              }}
            >
              Yes
            </Button>
            <Button
              onClick={this.handleClose}
              autoFocus={true}
              style={{
                paddingLeft: buttonPadding,
                paddingRight: buttonPadding
              }}
            >
              No
            </Button>
          </div>
        </div>
      </Dialog>
    );
  }
}
