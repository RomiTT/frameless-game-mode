import React from 'react';
import SelectAppView from './SelectAppView';
import Tasks from '../store/Tasks';
import { Button } from '@blueprintjs/core';
import styles from './SelectAppPage.module.scss';

interface IProps {
  onNext: (item: any) => void;
  onCancel: () => void;
}

interface IState {
  listApp: object[];
}

export default class SelectAppPage extends React.PureComponent<IProps, IState> {
  private taskFGM = Tasks.FGM;
  state = {
    listApp: []
  };

  constructor(props: IProps) {
    super(props);
    console.log('constructor of SelectAppPage');
  }

  componentDidMount = async () => {
    this.updateList();
  };

  private updateList = async () => {
    const list = await this.taskFGM.getWindowAppList();
    this.setState({ listApp: list });
  };

  render() {
    return (
      <SelectAppView
        listApp={this.state.listApp}
        onRefreshList={this.updateList}
        renderButtons={(index: number, item: any) => (
          <>
            <Button
              onClick={() => {
                this.props.onNext(item);
              }}
              intent='primary'
              disabled={item === null}
              className={styles.buttonPadding}
              text='Next'
            />
            <Button onClick={this.props.onCancel} className={styles.buttonPadding} text='Cancel' />
          </>
        )}
      />
    );
  }
}
