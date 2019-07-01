import React from 'react';
import ReactDOM from 'react-dom';
import { autorun } from 'mobx';
import { inject } from 'mobx-react';
import { Colors, H4, H5 } from '@blueprintjs/core';
import { IStoreFGM } from '../stores/StoreFGM';
import styles from './WindowAppList.module.scss';

const { List } = require('react-virtualized');

interface WindowAppListProps {
  storeFGM?: IStoreFGM;
  //intervalToUpdate?: number;
}

interface WindowsAppListState {
  width: number;
  height: number;
  rowHeight: number;
  rowCount: number;
}

@inject('storeFGM')
class WindowAppList extends React.Component<
  WindowAppListProps,
  WindowsAppListState
> {
  static defaultProps = {
    intervalToUpdate: 300
  };

  listId: string;
  listNode: HTMLElement | null;
  dummyElement: HTMLElement | null;
  timerId: any;

  constructor(props: WindowAppListProps) {
    super(props);

    this.state = {
      width: 0,
      height: 0,
      rowHeight: 0,
      rowCount: 0
    };

    this.listId = 'romitt_windowapplist_id';
    this.listNode = document.getElementById(this.listId);
    this.dummyElement = document.createElement('div');
    this.timerId = 0;
  }

  componentDidMount() {
    autorun(() => {
      this.setState({ rowCount: this.props.storeFGM!.listWindowApp.length });
    });

    this.timerId = setInterval(() => {
      this.props.storeFGM!.updateWindowAppList();
    }, this.props.storeFGM!.intervalToUpdateList);

    window.addEventListener('DOMContentLoaded', this.handleResize);
    window.addEventListener('resize', this.handleResize);

    this.listNode = document.getElementById(this.listId);
    this.handleResize();
  }

  componentWillUnmount() {
    clearInterval(this.timerId);
    window.removeEventListener('DOMContentLoaded', this.handleResize);
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    if (this.listNode) {
      let parent = this.listNode.parentElement;
      console.log(parent);

      if (parent) {
        let newRowHeight = this.calcRowHeight();
        console.log('newRowHeight=', newRowHeight);
        this.setState({
          width: parent.offsetWidth,
          height: parent.offsetHeight,
          rowHeight: newRowHeight
        });
      }
    }
  };

  renderRow = (arg: {
    key: any; // Unique key within array of rows
    index: any; // Index of row within collection
    isScrolling: any; // The List is currently being scrolled
    isVisible: any; // This row is visible within the List (eg it is not an overscanned row)
    style: any; // Style object to be applied to row (to position it)
  }) => {
    const item: any = this.props.storeFGM!.listWindowApp[arg.index];

    return (
      <div key={arg.key} className={styles.listItem}>
        <p className={`bp3-text-large ${styles.processName}`}>
          Process: {item.processName}
        </p>
        <p className={`bp3-text-small ${styles.title}`}>Title: {item.title}</p>
      </div>
    );
  };

  calcRowHeight() {
    ReactDOM.render(
      <div className={styles.listItem}>
        <p className={`bp3-text-large ${styles.processName}`}>
          Process: application.exe
        </p>
        <p className={`bp3-text-small ${styles.title}`}>Title: title</p>
      </div>,
      this.dummyElement
    );

    let h = 0;
    if (this.listNode && this.dummyElement) {
      this.listNode.appendChild(this.dummyElement);
      h = this.dummyElement.offsetHeight;
      this.listNode.removeChild(this.dummyElement);
    }

    return h;
  }

  render() {
    return (
      <List
        id={this.listId}
        autoHeight={true}
        width={this.state.width}
        height={this.state.height}
        rowCount={this.state.rowCount}
        rowHeight={this.state.rowHeight}
        rowRenderer={this.renderRow}
        style={{ backgroundColor: Colors.DARK_GRAY2 }}
      />
    );
  }
}

export default WindowAppList;
