import React from 'react';
import { autorun } from 'mobx';
import { inject } from 'mobx-react';
import logo from './logo.svg';
import { TitleBar, TitleBarTheme } from './components/FramelessTitleBar';
import MainContent from './components/MainContent';
import AppLayout from './components/AppLayout';
import {
  Navbar,
  Colors,
  H1,
  Classes,
  Alignment,
  NavbarDivider,
  Button,
  NavbarGroup,
  NavbarHeading,
  ContextMenu,
  Menu,
  MenuItem
} from '@blueprintjs/core';
import { FGM_STATE, FGM_MODE } from './components/FGM';

import WindowAppList from './components/WindowAppList';
import { IStoreFGM } from './stores/StoreFGM';
import styles from './App.module.scss';
import FloatingButton from './components/FloatingButton';
import AddAppDialog from './components/AddAppDialog/AddAppDialog';
import YesNoDialog from './components/YesNoDialog';

const { ipcRenderer } = require('electron');

interface AppProps {
  storeFGM?: IStoreFGM;
}

interface AppState {
  stateFGM: FGM_STATE;
}

@inject('storeFGM')
class App extends React.Component<AppProps, AppState> {
  headerRef: any;
  listRef: React.RefObject<WindowAppList>;
  addAppDialogRef: React.RefObject<AddAppDialog>;
  yesNoDialogRef: React.RefObject<YesNoDialog>;
  addButtonRef: React.RefObject<FloatingButton>;

  constructor(props: any) {
    super(props);

    this.headerRef = React.createRef();
    this.listRef = React.createRef();
    this.addAppDialogRef = React.createRef();
    this.yesNoDialogRef = React.createRef();
    this.addButtonRef = React.createRef();
    this.props.storeFGM!.load();
    this.state = {
      stateFGM: this.props.storeFGM!.state
    };
  }

  componentDidMount() {
    autorun(() => {
      this.setState({ stateFGM: this.props.storeFGM!.state });
    });

    if (this.props.storeFGM!.startOnLaunch) {
      this.props.storeFGM!.start();
    }

    ipcRenderer.on('close', this.handleCloseApp);
  }

  handleCloseApp = () => {
    this.props.storeFGM!.save();
    ipcRenderer.send('closed');
  };

  render() {
    let addBtnLeft = 0;
    if (this.headerRef.current) {
      addBtnLeft = this.headerRef.current.offsetWidth - 52;
    }
    return (
      <AppLayout className='bp3-dark' bodyBackgroundColor={Colors.GOLD5}>
        <header ref={this.headerRef}>
          <TitleBar
            app='Frameless Game Mode'
            icon={`./appIcon.ico`}
            theme={TitleBarTheme}
          />
          <Navbar style={{ height: 'auto', overflow: 'hidden' }}>
            <NavbarGroup align={Alignment.LEFT}>
              <NavbarHeading>Game List</NavbarHeading>
            </NavbarGroup>
            <NavbarGroup align={Alignment.RIGHT}>
              <NavbarDivider />
              <Button
                disabled={this.state.stateFGM == FGM_STATE.STARTED}
                className={Classes.MINIMAL}
                intent={
                  this.state.stateFGM == FGM_STATE.STARTED ? 'none' : 'success'
                }
                icon='play'
                onClick={() => {
                  this.props.storeFGM!.start();
                }}
              />
              <Button
                disabled={
                  this.state.stateFGM == FGM_STATE.PAUSED ||
                  this.state.stateFGM == FGM_STATE.STOPPED
                }
                className={Classes.MINIMAL}
                icon='pause'
                intent={
                  this.state.stateFGM == FGM_STATE.PAUSED ||
                  this.state.stateFGM == FGM_STATE.STOPPED
                    ? 'none'
                    : 'success'
                }
                onClick={() => {
                  this.props.storeFGM!.pause();
                }}
              />
              <Button
                disabled={this.state.stateFGM == FGM_STATE.STOPPED}
                className={Classes.MINIMAL}
                icon='stop'
                intent={
                  this.state.stateFGM == FGM_STATE.STOPPED ? 'none' : 'danger'
                }
                onClick={() => {
                  this.props.storeFGM!.stop();
                }}
              />
              <Button className={Classes.MINIMAL} icon='cog' intent='warning' />
            </NavbarGroup>
          </Navbar>
        </header>
        <main>
          <WindowAppList
            listApp={this.props.storeFGM!.listAppToMonitor}
            ref={this.listRef}
            onContextMenu={(e: any, item: any) => {
              e.preventDefault();

              const menu = React.createElement(
                Menu,
                { className: 'bp3-ui-text' }, // empty props
                React.createElement(MenuItem, {
                  //className: 'bp3-menu-item',
                  text: 'Delete',
                  icon: 'delete',
                  onClick: () => {
                    this.yesNoDialogRef.current!.open(
                      'Delete item',
                      'Are you sure to delete?',
                      () => {
                        // onOk
                        this.props.storeFGM!.removeApp(item.key);
                        this.listRef.current!.forceUpdate();
                      }
                    );
                  }
                }),
                React.createElement(MenuItem, {
                  //className: 'bp3-menu-item',
                  text: 'Properties...',
                  icon: 'properties',
                  onClick: () => {}
                })
              );

              // mouse position is available on event
              ContextMenu.show(
                menu,
                { left: e.clientX, top: e.clientY },
                () => {
                  // menu was closed; callback optional
                },
                true
              );
            }}
          />
          <FloatingButton
            position='fixed'
            left={addBtnLeft}
            top={87}
            icon='add'
            intent='danger'
            scale={1.2}
            onClick={() => {
              this.addAppDialogRef.current!.open();
            }}
          />
          <AddAppDialog
            ref={this.addAppDialogRef}
            onOK={(item, wpos, wsize, width, height) => {
              this.props.storeFGM!.addApp(item, wpos, wsize, width, height);
              this.listRef.current!.forceUpdate();
            }}
          />
          <YesNoDialog ref={this.yesNoDialogRef} />
        </main>

        <footer className={`has-text-centered ${styles.footer}`} />
      </AppLayout>
    );
  }
}

export default App;
