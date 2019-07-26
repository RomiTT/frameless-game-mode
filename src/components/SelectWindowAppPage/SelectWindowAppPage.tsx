import React from 'react';
import SelectWindowAppView from '../SelectWindowAppView/SelectWindowAppView';
import Tasks from '../../store/Tasks';
import { Button, Classes } from '@blueprintjs/core';
import Logger from '../../lib/Logger';
import styles from './SelectWindowAppPage.module.scss';

interface IProps {
  onNext: (item: any) => void;
  onCancel: () => void;
}

interface IState {
  listApp: object[];
  selectedIndex: number;
  selectedItem: any;
}

export default class SelectWindowAppPage extends React.Component<IProps, IState> {
  private taskFGM = Tasks.FGM;
  private pendingUpdateList = false;
  private selectWindowAppViewRef: React.RefObject<SelectWindowAppView> = React.createRef();
  state = {
    listApp: [],
    selectedIndex: -1,
    selectedItem: null
  };

  constructor(props: IProps) {
    super(props);
  }

  componentDidMount = async () => {
    this.updateList();
  };

  shouldComponentUpdate = (nextProps: IProps, nextState: IState) => {
    if (this.pendingUpdateList) {
      return false;
    } else if (
      this.state.listApp === nextState.listApp &&
      this.state.selectedItem === nextState.selectedItem &&
      this.state.selectedIndex === nextState.selectedIndex
    ) {
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

  private handleSelectionChange = (index: number, item: any) => {
    this.setState({ selectedIndex: index, selectedItem: item });
  };

  private handleNext = () => {
    this.props.onNext(this.state.selectedItem);
  };

  render() {
    Logger.logRenderInfo(this);
    return (
      <>
        <div className={`${Classes.DIALOG_BODY} ${styles.dialogBody}`}>
          <SelectWindowAppView
            ref={this.selectWindowAppViewRef}
            listApp={this.state.listApp}
            onRefreshList={this.updateList}
            onSelectionChange={this.handleSelectionChange}
          />
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button
              onClick={this.handleNext}
              intent='primary'
              disabled={this.state.selectedItem === null}
              className='dialogButtonPadding'
              text='Next'
            />
            <Button onClick={this.props.onCancel} className='dialogButtonPadding' text='Cancel' />
          </div>
        </div>
      </>
    );
  }
}
