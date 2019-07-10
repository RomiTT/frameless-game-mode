import React from 'react';
import { Button, Divider } from '@blueprintjs/core/lib/esm/components';
import { Classes } from '@blueprintjs/core/lib/esm/common';
import WindowAppList from '../WindowAppList';
import FloatingButton from '../FloatingButton';
import styles from './AddAppDialog.module.scss';

interface SelectAppPageProps {
  listApp: Array<object>;
  onNext: (item: any) => void;
  onCancel: () => void;
  onRefreshList: () => void;
}

export default class SelectAppPage extends React.Component<
  SelectAppPageProps,
  any
> {
  listRef: React.RefObject<WindowAppList> = React.createRef();
  state = {
    disabledNextButton: true
  };

  handleNext = () => {
    if (this.listRef.current) {
      this.props.onNext(this.listRef.current.getSelectedItem());
    }
  };

  handleSelectionChange = (item: any) => {
    this.setState({ disabledNextButton: item == null });
  };

  render() {
    return (
      <>
        <div className={Classes.DIALOG_BODY} style={{ position: 'relative' }}>
          <WindowAppList
            ref={this.listRef}
            listApp={this.props.listApp}
            style={{ height: '350px', border: 'solid 1px gray' }}
            onSelectionChange={this.handleSelectionChange}
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
        <Divider />
        <div className={Classes.DIALOG_FOOTER} style={{ paddingTop: '10px' }}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button
              onClick={this.handleNext}
              intent='primary'
              disabled={this.state.disabledNextButton}
              className={styles.buttonPadding}
            >
              Next
            </Button>
            <Button
              onClick={this.props.onCancel}
              className={styles.buttonPadding}
            >
              Cancel
            </Button>
          </div>
        </div>
      </>
    );
  }
}
