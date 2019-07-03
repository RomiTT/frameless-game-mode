import React from 'react';
import ReactDOM from 'react-dom';
import { autorun } from 'mobx';
import { inject } from 'mobx-react';
import { Colors, H4, H5 } from '@blueprintjs/core';
import { IStoreFGM } from '../stores/StoreFGM';
import styles from './WindowAppList.module.scss';

interface WindowAppListProps {
  storeFGM?: IStoreFGM;
  //enableVariableRowHeight?: boolean;
  //intervalToUpdate?: number;
}

interface WindowsAppListState {
  listData: Array<object>;
  selectedIndex: number;
}

@inject('storeFGM')
class WindowAppList extends React.Component<
  WindowAppListProps,
  WindowsAppListState
> {
  static defaultProps = {
    //enableVariableRowHeight: true
    //intervalToUpdate: 300
  };

  timerId: any;

  constructor(props: WindowAppListProps) {
    super(props);

    this.state = {
      listData: new Array<object>(),
      selectedIndex: -1
    };

    this.timerId = 0;
  }

  componentDidMount() {
    this.timerId = setInterval(() => {
      this.props.storeFGM!.updateWindowAppList((list: Array<object>) => {
        this.setState({ listData: list });
      });
    }, this.props.storeFGM!.intervalToUpdateList);
  }

  componentWillUnmount() {
    clearInterval(this.timerId);
  }

  renderItem = (index: number) => {
    const item: any = this.state.listData[index];
    const classes =
      this.state.selectedIndex === index
        ? styles.listItemSelected
        : styles.listItem;
    return (
      <div
        key={index}
        className={classes}
        onClick={() => {
          this.setState({ selectedIndex: index });
        }}
      >
        <p className={styles.processName}>Process: {item.processName}</p>
        <p className={styles.title}>Title: {item.title}</p>
      </div>
    );
  };

  render() {
    const list = new Array<any>();
    for (let i = 0; i < this.state.listData.length; i++) {
      list.push(this.renderItem(i));
    }

    return (
      <div style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
        {list}
      </div>
    );
  }
}

export default WindowAppList;
