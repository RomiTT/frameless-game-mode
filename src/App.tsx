import React from 'react';
import { autorun } from 'mobx';
import { inject } from 'mobx-react';
import logo from './logo.svg';
import { TitleBar, TitleBarTheme } from './components/FramelessTitleBar';
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
  MenuItem,
  Icon,
  Intent
} from '@blueprintjs/core';
import {
  FGM_STATE,
  FGM_WATCH_MODE,
  FGM_WINDOW_POSITION,
  FGM_WINDOW_SIZE
} from './components/FGM';

import WindowAppList from './components/WindowAppList';
import { IStoreFGM } from './stores/StoreFGM';
import styles from './App.module.scss';
import FloatingButton from './components/FloatingButton';
import AddAppDialog from './components/AddAppDialog';
import YesNoDialog from './components/YesNoDialog';
import SettingsDialog from './components/SettingsDialog';

const { remote, ipcRenderer } = require('electron');

interface AppProps {
  storeFGM?: IStoreFGM;
}

interface AppState {
  stateFGM: FGM_STATE;
  stateText: string;
  stateColor: string;
  addBtnLeftPos: number;
}

@inject('storeFGM')
export default class App extends React.PureComponent<AppProps, AppState> {
  private store = this.props.storeFGM;
  private listRef: React.RefObject<WindowAppList> = React.createRef();
  private addAppDialogRef: React.RefObject<AddAppDialog> = React.createRef();
  private yesNoDialogRef: React.RefObject<YesNoDialog> = React.createRef();
  private settingsDialogRef: React.RefObject<
    SettingsDialog
  > = React.createRef();
  state = {
    stateFGM: this.store!.state,
    stateText: '',
    stateColor: Colors.GRAY3,
    addBtnLeftPos: 0
  };

  componentDidMount() {
    this.store!.load();

    const bound = this.store!.windowBound;
    const mainWindow = remote.getCurrentWindow();

    if (bound.width === 0 && bound.height === 0) {
      this.store!.setWindowBound(mainWindow.getBounds());
    } else {
      mainWindow.setBounds(bound);
    }

    mainWindow.show();
    this.listRef.current!.forceUpdate();

    this.store!.start();

    window.addEventListener('resize', this.handleResize);
    this.handleResize();

    ipcRenderer.on('close', this.handleCloseApp);
    autorun(() => {
      const newState = this.store!.state;
      let newStateText: string = '';
      let newStateColor: string = Colors.GRAY3;

      switch (newState) {
        case FGM_STATE.STARTED:
          newStateText = 'started';
          newStateColor = Colors.GREEN5;
          break;

        case FGM_STATE.PAUSED:
          newStateText = 'paused';
          newStateColor = Colors.GOLD3;
          break;

        case FGM_STATE.STOPPED:
          newStateText = 'stopped';
          newStateColor = Colors.GRAY3;
          break;
      }
      this.setState({
        stateFGM: newState,
        stateText: newStateText,
        stateColor: newStateColor
      });
    });
  }

  private handleResize = () => {
    this.setState({ addBtnLeftPos: window.innerWidth - 52 });
  };

  private handleCloseApp = () => {
    const mainWindow = remote.getCurrentWindow();
    this.store!.setWindowBound(mainWindow.getBounds());

    this.store!.save();
    this.store!.stop();
    window.removeEventListener('resize', this.handleResize);
    ipcRenderer.send('closed');
  };

  private handleStart = () => {
    this.store!.start();
  };

  private handlePause = () => {
    this.store!.pause();
  };

  private handleStop = () => {
    this.store!.stop();
  };

  private handleOpenSettings = () => {
    this.settingsDialogRef.current!.open();
  };

  private handleContextMenu = (e: any, item: any) => {
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
              this.store!.removeApp(item.key);
              this.store!.save();
              this.listRef.current!.forceUpdate();
            }
          );
        }
      })
      // React.createElement(MenuItem, {
      //   //className: 'bp3-menu-item',
      //   text: 'Properties...',
      //   icon: 'properties',
      //   onClick: () => {}
      // })
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
  };

  private handleOpenAddAppDialog = () => {
    this.addAppDialogRef.current!.open(
      (
        item: any,
        wpos: FGM_WINDOW_POSITION,
        wsize: FGM_WINDOW_SIZE,
        width: number,
        height: number
      ) => {
        this.store!.addApp(item, wpos, wsize, width, height);
        this.store!.save();
        this.listRef.current!.forceUpdate();
      }
    );
  };

  render() {
    return (
      <>
        <TitleBar
          app='Frameless Game Mode'
          icon={`./appIcon.png`}
          theme={TitleBarTheme}
        />
        <AppLayout className='bp3-dark' bodyBackgroundColor={Colors.GOLD5}>
          <header>
            <Navbar style={{ height: 'auto', overflow: 'hidden' }}>
              <NavbarGroup align={Alignment.LEFT}>
                <NavbarHeading>Game List</NavbarHeading>
              </NavbarGroup>
              <NavbarGroup align={Alignment.RIGHT}>
                <NavbarDivider />
                <Button
                  disabled={this.state.stateFGM == FGM_STATE.STARTED}
                  className={Classes.MINIMAL}
                  icon='play'
                  onClick={this.handleStart}
                />
                <Button
                  disabled={
                    this.state.stateFGM == FGM_STATE.PAUSED ||
                    this.state.stateFGM == FGM_STATE.STOPPED
                  }
                  className={Classes.MINIMAL}
                  icon='pause'
                  onClick={this.handlePause}
                />
                <Button
                  disabled={this.state.stateFGM == FGM_STATE.STOPPED}
                  className={Classes.MINIMAL}
                  icon='stop'
                  onClick={this.handleStop}
                />
                <Button
                  className={Classes.MINIMAL}
                  icon='cog'
                  onClick={this.handleOpenSettings}
                />
              </NavbarGroup>
            </Navbar>
          </header>
          <main>
            <WindowAppList
              listApp={this.store!.listAppToMonitor}
              ref={this.listRef}
              onContextMenu={this.handleContextMenu}
            />
            <FloatingButton
              position='fixed'
              left={this.state.addBtnLeftPos}
              top={87}
              icon='add'
              intent='warning'
              scale={1.2}
              onClick={this.handleOpenAddAppDialog}
            />
            <AddAppDialog ref={this.addAppDialogRef} />
            <YesNoDialog ref={this.yesNoDialogRef} />
            <SettingsDialog ref={this.settingsDialogRef} />
          </main>

          <footer className={`has-text-centered ${styles.footer}`}>
            <Icon
              className={styles.stateIcon}
              icon='record'
              iconSize={18}
              color={this.state.stateColor}
            />
            <p className={styles.stateText}>{this.state.stateText}</p>
          </footer>
        </AppLayout>
      </>
    );
  }
}
