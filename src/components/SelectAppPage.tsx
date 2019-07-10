import React from 'react';
import WindowAppList from './WindowAppList';
import FloatingButton from './FloatingButton';
import styles from './SelectAppPage.module.scss';

interface SelectAppPageProps {
  listApp: Array<object>;
  onRefreshList: () => void;
  onSelectionChange?: (item: any) => void;
}

export default class SelectAppPage extends React.Component<
  SelectAppPageProps,
  any
> {
  private listRef: React.RefObject<WindowAppList> = React.createRef();

  getData = () => {
    if (this.listRef.current) {
      return this.listRef.current.getSelectedItem();
    }

    return null;
  };

  render() {
    return (
      <div className={styles.selectAppRoot}>
        <WindowAppList
          ref={this.listRef}
          listApp={this.props.listApp}
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
          onClick={this.props.onRefreshList}
        />
      </div>
    );
  }
}
