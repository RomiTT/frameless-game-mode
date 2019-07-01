import React from 'react';
import ReactDOM from 'react-dom';
import { autorun } from 'mobx';
import { inject } from 'mobx-react';
import { Colors, H4, H5 } from '@blueprintjs/core';
import { IStoreFGM } from '../stores/StoreFGM';

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
  listItemStyle: React.CSSProperties;
  processNameStyle: React.CSSProperties;
  titleStyle: React.CSSProperties;

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

    this.listItemStyle = {
      backgroundColor: Colors.DARK_GRAY2,
      borderBottom: 'solid 1px',
      borderBottomColor: Colors.GRAY1,
      paddingLeft: '8px',
      paddingRight: '8px',
      paddingTop: '2px',
      paddingBottom: '4px'
    };

    this.processNameStyle = {
      color: Colors.GOLD5,
      whiteSpace: 'nowrap'
    };

    this.titleStyle = {
      color: Colors.LIGHT_GRAY3,
      paddingLeft: '8px',
      whiteSpace: 'nowrap'
    };
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
      <div key={arg.key} style={this.listItemStyle}>
        <H5 style={this.processNameStyle}>Process: {item.processName}</H5>
        <p className='bp3-text-small' style={this.titleStyle}>
          Title: {item.title}
        </p>
      </div>
    );
  };

  calcRowHeight() {
    ReactDOM.render(
      <div style={this.listItemStyle}>
        <H5 style={this.processNameStyle}>Process: application.exe</H5>
        <p className='bp3-text-small' style={this.titleStyle}>
          Title: title
        </p>
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
