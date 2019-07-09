import React from 'react';
import ReactDOM from 'react-dom';
import { autorun } from 'mobx';
import { inject } from 'mobx-react';
import { Button, Colors, H4, H5, Icon } from '@blueprintjs/core';
import { IStoreFGM } from '../stores/StoreFGM';
import styles from './WindowAppList.module.scss';
import FloatingButton from './FloatingButton';

interface WindowAppListProps {
  storeFGM?: IStoreFGM;
  //enableVariableRowHeight?: boolean;
  //intervalToUpdate?: number;
}

interface WindowsAppListState {
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
  listRef: React.RefObject<HTMLDivElement>;

  constructor(props: WindowAppListProps) {
    super(props);

    this.state = {
      selectedIndex: -1
    };

    this.timerId = 0;
    this.listRef = React.createRef();
  }

  componentDidMount() {}

  componentWillUnmount() {
    clearInterval(this.timerId);
  }

  handleKeyDown = (e: any) => {
    // Arrow up
    if (e.keyCode === 38) {
      if (this.state.selectedIndex > 0) {
        let newIndex = this.state.selectedIndex - 1;
        console.log('newIndex=', newIndex);
        this.setState({ selectedIndex: newIndex });
      }
    }
    // Arrow Down
    else if (e.keyCode == 40) {
      if (
        this.state.selectedIndex <
        this.props.storeFGM!.listAppToMonitor.length - 1
      ) {
        let newIndex = this.state.selectedIndex + 1;
        console.log('newIndex=', newIndex);
        this.setState({ selectedIndex: newIndex });
      }
    }
  };

  renderItem = (index: number) => {
    const item: any = this.props.storeFGM!.listAppToMonitor[index];
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
          this.listRef.current!.focus();
        }}
      >
        <p className={styles.processName}>Process: {item.processName}</p>
        <p className={styles.title}>Title: {item.title}</p>
      </div>
    );
  };

  render() {
    const list = new Array<any>();
    const length = this.props.storeFGM!.listAppToMonitor.length;
    for (let i = 0; i < length; i++) {
      list.push(this.renderItem(i));
    }

    let btnLeft = 412;
    const e = this.listRef.current;
    if (e) {
      if (e.scrollHeight > e.clientHeight) {
        btnLeft = 394;
      }
    }

    return (
      <div
        tabIndex={0}
        ref={this.listRef}
        style={{
          width: '100%',
          height: '100%',
          overflowX: 'hidden',
          overflowY: 'auto',
          position: 'relative'
        }}
        onKeyDown={this.handleKeyDown}
        onBlurCapture={e => {
          console.log('onblur');
        }}
      >
        {list}
        <FloatingButton
          position='fixed'
          left={btnLeft}
          top={87}
          icon='add'
          intent='danger'
          scale={1.3}
          onClick={() => {}}
        />
      </div>
    );
  }
}

export default WindowAppList;
