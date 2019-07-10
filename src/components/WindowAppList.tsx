import React from 'react';
import styles from './WindowAppList.module.scss';

interface WindowAppListProps {
  listApp: Array<object>;
  style?: React.CSSProperties;
  onSelectionChange?: (item: any) => void;
  onCtxMenu?: (item: any) => void;
}

interface WindowsAppListState {
  selectedIndex: number;
}

class WindowAppList extends React.Component<
  WindowAppListProps,
  WindowsAppListState
> {
  static defaultProps = {};

  listRef: React.RefObject<HTMLDivElement>;

  constructor(props: WindowAppListProps) {
    super(props);

    this.state = {
      selectedIndex: -1
    };

    this.listRef = React.createRef();
  }

  getSelectedIndex() {
    return this.state.selectedIndex;
  }

  getSelectedItem() {
    if (
      this.state.selectedIndex < 0 ||
      this.state.selectedIndex >= this.props.listApp.length
    ) {
      return null;
    }

    return this.props.listApp[this.state.selectedIndex];
  }

  selectItem(index: number) {
    if (index < 0 || index >= this.props.listApp.length) return;

    if (this.state.selectedIndex != index) {
      this.setState({ selectedIndex: index });
      if (this.props.onSelectionChange) {
        this.props.onSelectionChange(this.props.listApp[index]);
      }
    }
  }

  unselectItem() {
    this.setState({ selectedIndex: -1 });
    if (this.props.onSelectionChange) {
      this.props.onSelectionChange(null);
    }
  }

  handleKeyDown = (e: any) => {
    // Arrow up
    if (e.keyCode === 38) {
      if (this.state.selectedIndex > 0) {
        this.selectItem(this.state.selectedIndex - 1);
      }
    }
    // Arrow Down
    else if (e.keyCode == 40) {
      if (this.state.selectedIndex < this.props.listApp.length - 1) {
        this.selectItem(this.state.selectedIndex + 1);
      }
    }
  };

  renderItem = (index: number) => {
    const item: any = this.props.listApp[index];
    const classes =
      this.state.selectedIndex === index
        ? styles.listItemSelected
        : styles.listItem;
    return (
      <div
        key={index}
        className={classes}
        onContextMenu={() => {
          this.selectItem(index);
          if (this.props.onCtxMenu) {
            this.props.onCtxMenu(item);
          }
        }}
        onClick={() => {
          this.selectItem(index);
          this.listRef.current!.focus();
        }}
      >
        <div className={styles.innerContainer}>
          <p className={styles.processName}>Process: {item.processName}</p>
          <p className={styles.title}>Title: {item.title}</p>
        </div>
      </div>
    );
  };

  render() {
    const list = new Array<any>();
    const length = this.props.listApp.length;
    for (let i = 0; i < length; i++) {
      list.push(this.renderItem(i));
    }

    return (
      <div
        style={this.props.style}
        tabIndex={0}
        className={styles.appList}
        ref={this.listRef}
        onKeyDown={this.handleKeyDown}
      >
        {list}
      </div>
    );
  }
}

export default WindowAppList;
