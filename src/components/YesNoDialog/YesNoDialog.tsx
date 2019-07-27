import React from 'react';
import { Button, Dialog } from '@blueprintjs/core/lib/esm/components';
import { Classes } from '@blueprintjs/core/lib/esm/common';
import Logger from '../../lib/Logger';
import styles from './YesNoDialog.module.scss';
import { IAppState } from '../../store/Types';
import { getLocaleNameFromLanguage } from '../../lib/lang';
import { connect } from 'react-redux';

interface IProps {
  langData: any;
  getRef: any;
}

interface IState {
  isOpen: boolean;
  title: string;
  message: string;
}

type DialogCallback = () => void;

class YesNoDialog extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.props.getRef.current = this;
  }

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
    const { langData } = this.props;

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
            <Button
              className='dialogButtonPadding'
              onClick={this.handleYes}
              intent='primary'
              text={langData.buttonYes}
            />
            <Button
              className='dialogButtonPadding'
              onClick={this.handleClose}
              autoFocus={true}
              text={langData.buttonNo}
            />
          </div>
        </div>
      </Dialog>
    );
  }
}

const mapStateToProps = (state: IAppState, ownProps?: any) => {
  Logger.log('YesNoDialog-mapStateToProps, state=', state, ', ownProps=', ownProps);

  const localeName = getLocaleNameFromLanguage(state.currentLanguage);
  const langData: any = require(`./languages/${localeName}.json`);
  return {
    langData: langData
  };
};

export default connect(mapStateToProps)(YesNoDialog);
