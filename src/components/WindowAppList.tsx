import React from 'react';
import ReactDOM from 'react-dom';
import { autorun } from 'mobx';
import { inject } from 'mobx-react';
import { Colors, H4, H5 } from '@blueprintjs/core';
import { IStoreFGM } from '../stores/StoreFGM';
import VirtualList from 'react-tiny-virtual-list';
import styles from './WindowAppList.module.scss';

interface WindowAppListProps {
  storeFGM?: IStoreFGM;
  //enableVariableRowHeight?: boolean;
  //intervalToUpdate?: number;
}

interface WindowsAppListState {
  listData: Array<Object>;
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
  listComponent: VirtualList | null = null;

  constructor(props: WindowAppListProps) {
    super(props);

    this.state = {
      listData: new Array<Object>(),
      selectedIndex: -1
    };

    this.timerId = 0;
  }

  componentDidMount() {
    autorun(() => {
      this.setState({ listData: this.props.storeFGM!.listWindowApp });
      this.forceUpdate();
    });

    this.timerId = setInterval(() => {
      this.props.storeFGM!.updateWindowAppList();
    }, this.props.storeFGM!.intervalToUpdateList);
  }

  componentWillUnmount() {
    clearInterval(this.timerId);
  }

  renderItem = (index: number) => {
    const item: any = this.props.storeFGM!.listWindowApp[index];
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
    for (let i = 0; i < this.props.storeFGM!.listWindowApp.length; i++) {
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
