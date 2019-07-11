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
  MenuItem
} from '@blueprintjs/core';
import {
  FGM_STATE,
  FGM_MODE,
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

const { ipcRenderer } = require('electron');

interface AppProps {
  storeFGM?: IStoreFGM;
}

interface AppState {
  stateFGM: FGM_STATE;
}

@inject('storeFGM')
export default class App extends React.PureComponent<AppProps, AppState> {
  private listRef: React.RefObject<WindowAppList> = React.createRef();
  private addAppDialogRef: React.RefObject<AddAppDialog> = React.createRef();
  private yesNoDialogRef: React.RefObject<YesNoDialog> = React.createRef();
  private settingsDialogRef: React.RefObject<
    SettingsDialog
  > = React.createRef();
  state = {
    stateFGM: this.props.storeFGM!.state
  };

  componentDidMount() {
    this.props.storeFGM!.load();
    this.listRef.current!.forceUpdate();

    if (this.props.storeFGM!.startOnLaunch) {
      this.props.storeFGM!.start();
    }
    ipcRenderer.on('close', this.handleCloseApp);
    autorun(() => {
      this.setState({ stateFGM: this.props.storeFGM!.state });
    });
  }

  private handleCloseApp = () => {
    this.props.storeFGM!.save();
    this.props.storeFGM!.stop();
    ipcRenderer.send('closed');
  };

  private handleStart = () => {
    this.props.storeFGM!.start();
  };

  private handlePause = () => {
    this.props.storeFGM!.pause();
  };

  private handleStop = () => {
    this.props.storeFGM!.stop();
  };

  private handleOpenSettings = () => {
    this.settingsDialogRef.current!.open(() => {});
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
              this.props.storeFGM!.removeApp(item.key);
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
        this.props.storeFGM!.addApp(item, wpos, wsize, width, height);
        this.listRef.current!.forceUpdate();
      }
    );
  };

  render() {
    let addBtnLeft = 500 - 52;
    return (
      <AppLayout className='bp3-dark' bodyBackgroundColor={Colors.GOLD5}>
        <header>
          <TitleBar
            app='Frameless Game Mode'
            icon={`./appIcon.png`}
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
                onClick={this.handleStart}
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
                onClick={this.handlePause}
              />
              <Button
                disabled={this.state.stateFGM == FGM_STATE.STOPPED}
                className={Classes.MINIMAL}
                icon='stop'
                intent={
                  this.state.stateFGM == FGM_STATE.STOPPED ? 'none' : 'danger'
                }
                onClick={this.handleStop}
              />
              <Button
                className={Classes.MINIMAL}
                icon='cog'
                intent='warning'
                onClick={this.handleOpenSettings}
              />
            </NavbarGroup>
          </Navbar>
        </header>
        <main>
          <WindowAppList
            listApp={this.props.storeFGM!.listAppToMonitor}
            ref={this.listRef}
            onContextMenu={this.handleContextMenu}
          />
          <FloatingButton
            position='fixed'
            left={addBtnLeft}
            top={87}
            icon='add'
            intent='primary'
            scale={1.2}
            onClick={this.handleOpenAddAppDialog}
          />
          <AddAppDialog ref={this.addAppDialogRef} />
          <YesNoDialog ref={this.yesNoDialogRef} />
          <SettingsDialog ref={this.settingsDialogRef} />
        </main>

        <footer className={`has-text-centered ${styles.footer}`} />
      </AppLayout>
    );
  }
}
