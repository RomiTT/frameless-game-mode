import FloatingButton from './FloatingButton';
import React from 'react';
import WindowAppList from './WindowAppList';
import { Classes } from '@blueprintjs/core/lib/esm/common';
import { Divider } from '@blueprintjs/core';
import styles from './SelectAppPage.module.scss';

interface ISelectAppPageProps {
  listApp: Array<object>;
  selectedIndex: number;
  onRefreshList: () => void;
  onSelectionChange?: (item: any) => void;
  renderButtons: (pageInstance: SelectAppPage) => JSX.Element;
}

export default class SelectAppPage extends React.Component<
  ISelectAppPageProps
> {
  private listRef: React.RefObject<WindowAppList> = React.createRef();

  private handleRefreshList = () => {
    this.listRef.current!.unselect();
    this.props.onRefreshList();
  };

  getData = () => {
    if (this.listRef.current) {
      return {
        selectedIndex: this.listRef.current.getSelectedIndex(),
        selectedItemData: this.listRef.current.getSelectedItem()
      };
    }

    return null;
  };

  render() {
    return (
      <>
        <div className={`${Classes.DIALOG_BODY} ${styles.dialogPage}`}>
          <WindowAppList
            ref={this.listRef}
            listApp={this.props.listApp}
            selectedIndex={this.props.selectedIndex}
            className={styles.appList}
            onSelectionChange={this.props.onSelectionChange}
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
            {this.props.renderButtons(this)}
          </div>
        </div>
      </>
    );
  }
}
