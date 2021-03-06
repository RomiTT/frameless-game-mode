import FloatingButton from '../FloatingButton';
import React from 'react';
import WindowAppList from '../WindowAppList/WindowAppList';
import Logger from '../../lib/Logger';
import styles from './SelectWindowAppView.module.scss';

interface IProps {
  listApp: Array<object>;
  onRefreshList: () => void;
  onSelectionChange: (index: number, item: any) => void;
}

interface IState {}

class SelectWindowAppView extends React.PureComponent<IProps, IState> {
  private listRef: React.RefObject<WindowAppList> = React.createRef();
  constructor(props: IProps) {
    super(props);
  }

  private handleRefreshList = () => {
    if (this.listRef.current) {
      this.listRef.current!.init();
    }
    this.props.onRefreshList();
  };

  render() {
    Logger.logRenderInfo(this);
    return (
      <div className={styles.rootView}>
        <WindowAppList
          ref={this.listRef}
          listApp={this.props.listApp}
          initialSelectIndex={-1}
          className={styles.appList}
          onSelectionChange={this.props.onSelectionChange}
        />
        <FloatingButton
          position='absolute'
          left={311}
          top={7}
          icon='refresh'
          intent='success'
          scale={1.1}
          onClick={this.handleRefreshList}
        />
      </div>
    );
  }
}

export default SelectWindowAppView;
