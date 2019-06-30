import React from 'react';
import ReactDOM from 'react-dom';
import { List } from 'react-virtualized';
import { Colors } from '@blueprintjs/core';
const { remote } = require('electron');
let FGM = remote.app.FGM;

class WindowAppList extends React.Component {
  listId = 'romitt_windowapplist_id';
  listNode = null;
  state = { width: 0, height: 0, rowHeight: 0, list: new Array() };
  timerId;
  dummyElement = null;
  listItemStyle = {
    backgroundColor: Colors.DARK_GRAY2,
    borderBottom: 'solid 1px',
    borderBottomColor: Colors.GRAY1,
    paddingLeft: '8px',
    paddingRight: '8px',
    paddingTop: '2px',
    paddingBottom: '4px'
  };
  processNameStyle = {
    fontSize: '1.2em',
    color: Colors.GOLD5,
    whiteSpace: 'nowrap'
  };
  titleStyle = { paddingLeft: '8px', fontSize: '0.9em', whiteSpace: 'nowrap' };

  componentDidMount() {
    this.dummyElement = document.createElement('div');

    this.timerId = setInterval(() => {
      FGM.getWindowAppList(newList => {
        this.setState({ list: newList });
      });
    }, this.props.intervalToUpdate);

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

  renderRow = ({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style // Style object to be applied to row (to position it)
  }) => {
    const item = this.state.list[index];

    return (
      <div key={key} style={this.listItemStyle}>
        <p style={this.processNameStyle}>Process: {item.processName}</p>
        <p style={this.titleStyle}>Title: {item.title}</p>
      </div>
    );
  };

  calcRowHeight() {
    ReactDOM.render(
      <div style={this.listItemStyle}>
        <p style={this.processNameStyle}>Process: application.exe</p>
        <p style={this.titleStyle}>Title: title</p>
      </div>,
      this.dummyElement
    );

    this.listNode.appendChild(this.dummyElement);
    let h = this.dummyElement.offsetHeight;
    this.listNode.removeChild(this.dummyElement);

    return h;
  }

  render() {
    return (
      <List
        id={this.listId}
        autoHeight={true}
        width={this.state.width}
        height={this.state.height}
        rowCount={this.state.list.length}
        rowHeight={this.state.rowHeight}
        rowRenderer={this.renderRow}
        style={{ backgroundColor: Colors.DARK_GRAY2 }}
      />
    );
  }
}

WindowAppList.defaultProps = {
  intervalToUpdate: 300
};

export default WindowAppList;
