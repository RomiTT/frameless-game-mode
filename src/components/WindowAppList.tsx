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
  enableVariableRowHeight?: boolean;
  //intervalToUpdate?: number;
}

interface WindowsAppListState {
  width: number;
  height: number;
  rowCount: number;
  rowHeight: number;
  selectedIndex: number;
}

@inject('storeFGM')
class WindowAppList extends React.Component<
  WindowAppListProps,
  WindowsAppListState
> {
  static defaultProps = {
    enableVariableRowHeight: false
    //intervalToUpdate: 300
  };

  listId: string;
  listNode: HTMLElement | null;
  dummyElement: HTMLElement | null;
  dummyElement2: HTMLElement | null;
  timerId: any;
  listComponent: any;

  constructor(props: WindowAppListProps) {
    super(props);

    this.state = {
      width: 0,
      height: 0,
      rowCount: 0,
      rowHeight: 0,
      selectedIndex: -1
    };

    this.listId = 'romitt_windowapplist_id';
    this.listNode = document.getElementById(this.listId);
    this.dummyElement = document.createElement('div');
    this.dummyElement2 = document.createElement('div');
    ReactDOM.render(
      <div className={styles.listItem}>
        <p className={`bp3-text-large ${styles.processNameNoWrap}`}>
          Process: application.exe
        </p>
        <p className={`bp3-text-small ${styles.titleNoWrap}`}>Title: title</p>
      </div>,
      this.dummyElement2
    );

    this.timerId = 0;
  }

  _setRef = (ref: any) => {
    this.listComponent = ref;
  };

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

      if (parent) {
        if (this.props.enableVariableRowHeight) {
          this.setState({
            width: parent.offsetWidth,
            height: parent.offsetHeight
          });

          setTimeout(() => {
            if (this.state.rowCount > 0) {
              for (let i = 0; i < this.state.rowCount; i++) {
                this.listComponent.recomputeRowHeights(i);
              }
            }

            this.listComponent.forceUpdateGrid();
          }, 10);
        } else {
          let newRowHeight = this.calcRowHeight();
          console.log('newRowHeight=', newRowHeight);
          this.setState({
            width: parent.offsetWidth,
            height: parent.offsetHeight,
            rowHeight: newRowHeight
          });
        }
      }
    }
  };

  calcRowHeight() {
    let h = 0;
    if (this.listNode && this.dummyElement2) {
      this.listNode.appendChild(this.dummyElement2);
      h = this.dummyElement2.offsetHeight;
      this.listNode.removeChild(this.dummyElement2);
    }

    return h;
  }

  renderRow = (arg: {
    key: any; // Unique key within array of rows
    index: any; // Index of row within collection
    isScrolling: any; // The List is currently being scrolled
    isVisible: any; // This row is visible within the List (eg it is not an overscanned row)
    style: any; // Style object to be applied to row (to position it)
  }) => {
    const item: any = this.props.storeFGM!.listWindowApp[arg.index];
    const classes =
      this.state.selectedIndex === arg.index
        ? styles.listItemSelected
        : styles.listItem;

    return (
      <div
        key={arg.key}
        className={classes}
        onClick={() => {
          this.setState({ selectedIndex: arg.index });
        }}
      >
        <p
          className={`bp3-text-large ${
            this.props.enableVariableRowHeight
              ? styles.processName
              : styles.processNameNoWrap
          }`}
        >
          Process: {item.processName}
        </p>
        <p
          className={`bp3-text-small ${
            this.props.enableVariableRowHeight
              ? styles.title
              : styles.titleNoWrap
          }`}
        >
          Title: {item.title}
        </p>
      </div>
    );
  };

  getRowHeight = (arg: { index: number }) => {
    const item: any = this.props.storeFGM!.listWindowApp[arg.index];
    this.dummyElement!.innerHTML = `
    <div class='${styles.listItem}'>
      <p class='bp3-text-large ${styles.processName}'>
        Process: ${item.processName}
      </p>
      <p class='bp3-text-small ${styles.title}'>Title: ${item.title}</p>
    </div>
    `;
    let h = 0;
    if (this.listNode && this.dummyElement) {
      this.listNode.appendChild(this.dummyElement);
      h = this.dummyElement.offsetHeight;
      this.listNode.removeChild(this.dummyElement);
    }

    return h;
  };

  render() {
    return (
      <List
        ref={this._setRef}
        id={this.listId}
        autoHeight={true}
        width={this.state.width}
        height={this.state.height}
        rowCount={this.state.rowCount}
        rowHeight={
          this.props.enableVariableRowHeight
            ? this.getRowHeight
            : this.state.rowHeight
        }
        rowRenderer={this.renderRow}
        style={{ backgroundColor: Colors.DARK_GRAY2 }}
      />
    );
  }
}

export default WindowAppList;
