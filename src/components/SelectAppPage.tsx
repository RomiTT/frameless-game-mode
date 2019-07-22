import React from 'react';
import SelectAppView from './SelectAppView';
import Tasks from '../store/Tasks';
import { Button } from '@blueprintjs/core';
import styles from './SelectAppPage.module.scss';
import Logger from '../lib/Logger';

interface IProps {
  onNext: (item: any) => void;
  onCancel: () => void;
}

interface IState {
  listApp: object[];
}

export default class SelectAppPage extends React.Component<IProps, IState> {
  private taskFGM = Tasks.FGM;
  private pendingUpdateList = false;
  state = {
    listApp: []
  };

  constructor(props: IProps) {
    super(props);
  }

  componentDidMount = async () => {
    this.updateList();
  };

  shouldComponentUpdate = (nextProps: IProps, nextState: IState) => {
    if (this.pendingUpdateList || this.state.listApp === nextState.listApp) {
      return false;
    }

    return true;
  };

  private updateList = async () => {
    this.pendingUpdateList = true;
    const list = await this.taskFGM.getWindowAppList();
    this.pendingUpdateList = false;
    this.setState({ listApp: list });
  };

  private renderButtons = (index: number, item: any) => {
    return (
      <>
        <Button
          onClick={() => {
            this.props.onNext(item);
          }}
          intent='primary'
          disabled={item === null}
          className='dialogButtonPadding'
          text='Next'
        />
        <Button onClick={this.props.onCancel} className='dialogButtonPadding' text='Cancel' />
      </>
    );
  };

  render() {
    Logger.logRenderInfo(this);
    return (
      <SelectAppView
        listApp={this.state.listApp}
        onRefreshList={this.updateList}
        renderButtons={this.renderButtons}
      />
    );
  }
}
