import React from 'react';
import { List } from 'react-virtualized';
import { Colors } from '@blueprintjs/core';
const { remote } = require('electron');
let FGM = remote.app.FGM;

class WindowAppList extends React.Component {
  listId = 'romitt_windowapplist_id';
  listNode = null;
  state = { width: 0, height: 0, list: new Array() };
  timerId;

  componentDidMount() {
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
        this.setState({
          width: parent.offsetWidth,
          height: parent.offsetHeight
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
    let app = this.state.list[index].processName;
    let i = app.lastIndexOf('\\');
    app = app.substring(i + 1);

    return (
      <div
        key={key}
        style={{
          backgroundColor: Colors.DARK_GRAY2,
          borderBottom: 'solid 1px',
          borderBottomColor: Colors.GRAY1,
          paddingLeft: '8px',
          paddingRight: '8px',
          paddingTop: '2px',
          paddingBottom: '4px'
        }}
      >
        <p style={{ fontSize: '1em', color: 'Yellow', whiteSpace: 'nowrap' }}>
          App: {app}
        </p>
        <p style={{ fontSize: '0.8em', whiteSpace: 'nowrap' }}>
          Title: {this.state.list[index].title}
        </p>
      </div>
    );
  };

  render() {
    return (
      <List
        id={this.listId}
        autoHeight={true}
        width={this.state.width}
        height={this.state.height}
        rowCount={this.state.list.length}
        rowHeight={60}
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
