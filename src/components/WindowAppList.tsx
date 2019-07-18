import React from 'react';
import styles from './WindowAppList.module.scss';

interface IWindowAppListRowItemProps {
  item: any;
  index: number;
  className: string;
  onClick: (index: number) => void;
  onContextMenu: (e: any, index: number, item: any) => void;
}

class WindowAppListRowItem extends React.PureComponent<IWindowAppListRowItemProps, any> {
  private handleContextMenu = (e: any) => {
    if (this.props.onContextMenu) {
      this.props.onContextMenu(e, this.props.index, this.props.item);
    }
  };

  private handleClick = () => {
    if (this.props.onClick) {
      this.props.onClick(this.props.index);
    }
  };

  render() {
    return (
      <div
        className={this.props.className}
        onContextMenu={this.handleContextMenu}
        onClick={this.handleClick}
      >
        <div className={styles.innerContainer}>
          <p className={styles.processName}>Process: {this.props.item.processName}</p>
          <p className={styles.title}>Title: {this.props.item.title}</p>
        </div>
      </div>
    );
  }
}

interface IWindowAppListProps {
  listApp: ReadonlyArray<object>;
  selectedIndex?: number;
  style?: React.CSSProperties;
  className?: string;
  onSelectionChange?: (index: number, item: any) => void;
  onContextMenu?: (e: any, item: any) => void;
}

interface IWindowsAppListState {
  selectedIndex: number;
}

export default class WindowAppList extends React.Component<
  IWindowAppListProps,
  IWindowsAppListState
> {
  static defaultProps = {};

  listRef: React.RefObject<HTMLDivElement>;

  constructor(props: IWindowAppListProps) {
    super(props);

    this.state = {
      selectedIndex: -1
    };

    this.listRef = React.createRef();
  }

  componentDidMount = () => {
    this.setState({ selectedIndex: this.props.selectedIndex ? this.props.selectedIndex! : -1 });
  };

  init = () => {
    if (this.listRef.current) {
      this.listRef.current!.scrollTop = 0;
    }

    this.setState({ selectedIndex: -1 });
  };

  getSelectedIndex() {
    return this.state.selectedIndex;
  }

  getSelectedItem() {
    if (this.state.selectedIndex < 0 || this.state.selectedIndex >= this.props.listApp.length) {
      return null;
    }

    return this.props.listApp[this.state.selectedIndex];
  }

  select(index: number) {
    if (index < 0 || index >= this.props.listApp.length) return;

    if (this.state.selectedIndex != index) {
      this.setState({ selectedIndex: index });
      if (this.props.onSelectionChange) {
        this.props.onSelectionChange(index, this.props.listApp[index]);
      }
    }
  }

  unselect() {
    this.setState({ selectedIndex: -1 });
    if (this.props.onSelectionChange) {
      this.props.onSelectionChange(-1, null);
    }
  }

  private handleKeyDown = (e: any) => {
    // Arrow up
    if (e.keyCode === 38) {
      if (this.state.selectedIndex > 0) {
        this.select(this.state.selectedIndex - 1);
      }
    }
    // Arrow Down
    else if (e.keyCode == 40) {
      if (this.state.selectedIndex < this.props.listApp.length - 1) {
        this.select(this.state.selectedIndex + 1);
      }
    }
  };

  private handleClick = (index: number) => {
    this.select(index);
    this.listRef.current!.focus();
  };

  private handleContextMenu = (e: any, index: number, item: any) => {
    this.select(index);
    if (this.props.onContextMenu) {
      this.props.onContextMenu(e, item);
    }
  };

  private renderItem = (index: number) => {
    const item: any = this.props.listApp[index];
    const classes = this.state.selectedIndex === index ? styles.listItemSelected : styles.listItem;
    return (
      <WindowAppListRowItem
        key={index}
        index={index}
        item={item}
        className={classes}
        onClick={this.handleClick}
        onContextMenu={this.handleContextMenu}
      />
    );
  };

  render() {
    console.log('WindowAppList - ', new Date().getMilliseconds());
    const list = new Array<any>();
    const length = this.props.listApp.length;
    for (let i = 0; i < length; i++) {
      list.push(this.renderItem(i));
    }

    return (
      <div
        style={this.props.style}
        tabIndex={0}
        className={`${styles.appList} ${this.props.className}`}
        ref={this.listRef}
        onKeyDown={this.handleKeyDown}
      >
        {list}
      </div>
    );
  }
}
