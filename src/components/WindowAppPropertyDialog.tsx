import React from 'react';
import { Dialog, Classes, Button } from '@blueprintjs/core';
import Logger from '../lib/Logger';
import styles from './WindowAppPropertyDialog.module.scss';
import { FGM_WINDOW_POSITION, FGM_WINDOW_SIZE } from '../lib/FGM';

type DialogCallback = () => void;

interface IProps {
  onOK?: DialogCallback;
}

interface IState {
  isOpen: boolean;
}

interface WPosViewerProps {
  wpos: FGM_WINDOW_POSITION;
}

class WPosViewer extends React.PureComponent<WPosViewerProps> {
  private getClassName = (wpos: FGM_WINDOW_POSITION) => {
    return this.props.wpos === wpos ? styles.itemSelected : styles.item;
  };

  render() {
    return (
      <div className={styles.wposView}>
        <div className={styles.row}>
          <div className={this.getClassName(FGM_WINDOW_POSITION.LEFT_TOP)} />
          <div className={this.getClassName(FGM_WINDOW_POSITION.MIDDLE_TOP)} />
          <div className={this.getClassName(FGM_WINDOW_POSITION.RIGHT_TOP)} />
        </div>
        <div className={styles.row}>
          <div className={this.getClassName(FGM_WINDOW_POSITION.LEFT_CENTER)} />
          <div className={this.getClassName(FGM_WINDOW_POSITION.MIDDLE_CENTER)} />
          <div className={this.getClassName(FGM_WINDOW_POSITION.RIGHT_CENTER)} />
        </div>
        <div className={styles.row}>
          <div className={this.getClassName(FGM_WINDOW_POSITION.LEFT_BOTTOM)} />
          <div className={this.getClassName(FGM_WINDOW_POSITION.MIDDLE_BOTTOM)} />
          <div className={this.getClassName(FGM_WINDOW_POSITION.RIGHT_BOTTOM)} />
        </div>
      </div>
    );
  }
}

class WindowAppPropertyDialog extends React.PureComponent<IProps, IState> {
  item: any = {};
  sizeInfo: string = '';

  constructor(props: IProps) {
    super(props);
  }

  open = (item: any) => {
    this.item = item;
    this.setState({ isOpen: true });

    switch (this.item.wsize) {
      case FGM_WINDOW_SIZE.BASED_ON_CLIENT_AREA: {
        this.sizeInfo = 'Window-Client area (excluded frame-area)';
        break;
      }

      case FGM_WINDOW_SIZE.BASED_ON_WINDOW_AREA: {
        this.sizeInfo = 'Window area (included frame-area)';
        break;
      }

      case FGM_WINDOW_SIZE.FULL_SCREEN_SIZE: {
        this.sizeInfo = 'Full-screen';
        break;
      }

      case FGM_WINDOW_SIZE.CUSTOM_SIZE: {
        this.sizeInfo = `Custom size (width:${this.item.width}, height:${this.item.height})`;
        break;
      }
    }
  };

  private handleClose = () => {
    this.setState({ isOpen: false });
  };

  private handleOK = () => {
    this.setState({ isOpen: false });
    if (this.props.onOK) {
      this.props.onOK!();
    }
  };

  render() {
    Logger.logRenderInfo(this);
    const { processPath, title, wpos } = this.item;

    return (
      <Dialog
        className={`bp3-dark  ${styles.dialog}`}
        title='Properties'
        icon='properties'
        {...this.state}
        onClose={this.handleClose}
      >
        <div className={Classes.DIALOG_BODY}>
          <div className={styles.container}>
            <p className={styles.name}>Process:</p>
            <p className={styles.desc}>{processPath}</p>
          </div>
          <br />
          <div className={styles.container}>
            <p className={styles.name}>Title:</p>
            <p className={styles.desc}>{title}</p>
          </div>
          <br />
          <div className={styles.container}>
            <p className={styles.name}>Position:</p>
            <WPosViewer wpos={wpos} />
          </div>
          <br />
          <div className={styles.container}>
            <p className={styles.name}>Size:</p>
            <p className={styles.desc}>{this.sizeInfo}</p>
          </div>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button className='dialogButtonPadding' onClick={this.handleOK} intent='primary'>
              OK
            </Button>
          </div>
        </div>
      </Dialog>
    );
  }
}

export default WindowAppPropertyDialog;
