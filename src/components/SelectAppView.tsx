import FloatingButton from './FloatingButton';
import React from 'react';
import WindowAppList from './WindowAppList';
import { Classes } from '@blueprintjs/core/lib/esm/common';
import { Divider } from '@blueprintjs/core';
import styles from './SelectAppView.module.scss';

interface IProps {
  listApp: Array<object>;
  onRefreshList: () => void;
  renderButtons: (index: number, item: any) => JSX.Element;
}

interface IState {
  selectedIndex: number;
  selectedItem: any;
}

class SelectAppView extends React.PureComponent<IProps, IState> {
  private listRef: React.RefObject<WindowAppList> = React.createRef();
  state = {
    selectedIndex: -1,
    selectedItem: null
  };

  constructor(props: IProps) {
    super(props);
  }

  private handleRefreshList = () => {
    if (this.listRef.current) {
      this.listRef.current!.init();
    }
    this.props.onRefreshList();
  };

  private handleSelectionChange = (index: number, item: any) => {
    this.setState({ selectedIndex: index, selectedItem: item });
  };

  render() {
    return (
      <>
        <div className={`${Classes.DIALOG_BODY} ${styles.rootView}`}>
          <WindowAppList
            ref={this.listRef}
            listApp={this.props.listApp}
            selectedIndex={this.state.selectedIndex}
            className={styles.appList}
            onSelectionChange={this.handleSelectionChange}
          />
          <FloatingButton
            position='absolute'
            left={361}
            top={6}
            icon='refresh'
            intent='success'
            scale={1.1}
            onClick={this.handleRefreshList}
          />
        </div>
        <Divider className={styles.divider} />
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            {this.props.renderButtons(this.state.selectedIndex, this.state.selectedItem)}
          </div>
        </div>
      </>
    );
  }
}

export default SelectAppView;
