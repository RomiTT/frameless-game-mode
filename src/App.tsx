import AddAppDialog from './components/AddAppDialog';
import AppLayout from './components/AppLayout';
import FloatingButton from './components/FloatingButton';
import React from 'react';
import SettingsDialog from './components/SettingsDialog';
import Tasks from './store/Tasks';
import WindowAppList from './components/WindowAppList';
import YesNoDialog from './components/YesNoDialog';
import {
  Alignment,
  Button,
  Classes,
  Colors,
  ContextMenu,
  Icon,
  Menu,
  MenuItem,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading
} from '@blueprintjs/core';
import { connect } from 'react-redux';
import { FGM_STATE, FGM_WINDOW_POSITION, FGM_WINDOW_SIZE, FGM_WATCH_MODE } from './lib/FGM';
import { IAppState } from './store/Types';
import { TitleBar, TitleBarTheme } from './components/FramelessTitleBar';
import store from './store/Store';
import styles from './App.module.scss';
import Logger from './lib/Logger';
import WindowAppPropertyDialog from './components/WindowAppPropertyDialog';

const { remote, ipcRenderer } = require('electron');

interface IProps {
  listAppToMonitor: ReadonlyArray<object>;
  stateFGM: FGM_STATE;
}

interface IState {
  addBtnLeftPos: number;
}

class App extends React.PureComponent<IProps, IState> {
  private taskFGM = Tasks.FGM;
  private listRef: React.RefObject<WindowAppList> = React.createRef();
  private addAppDialogRef: React.RefObject<AddAppDialog> = React.createRef();
  private yesNoDialogRef: React.RefObject<YesNoDialog> = React.createRef();
  private settingsDialogRef: React.RefObject<SettingsDialog> = React.createRef();
  private windowAppPropertyDialog: React.RefObject<WindowAppPropertyDialog> = React.createRef();
  state = {
    addBtnLeftPos: 0
  };

  componentDidMount() {
    const remote = require('electron').remote;
    const argv = remote.process.argv;

    this.taskFGM.load();

    const bound = store.getState().windowBound;
    const mainWindow = remote.getCurrentWindow();

    if (bound.width > 0 && bound.height > 0) {
      mainWindow.setBounds(bound);
    }

    if (argv.length <= 1 || argv[1] !== '--silent') {
      mainWindow.show();
    }

    this.taskFGM.start();

    window.addEventListener('resize', this.handleResize);
    this.handleResize();

    ipcRenderer.on('close', this.handleCloseApp);
    ipcRenderer.on('quit', this.handleQuitApp);
    mainWindow.on('hide', this.handleHide);
  }

  private handleResize = () => {
    this.setState({ addBtnLeftPos: window.innerWidth - 52 });
  };

  private handleCloseApp = () => {
    const mainWindow = remote.getCurrentWindow();
    if (store.getState().closeToTray) {
      mainWindow.hide();
    } else {
      this.handleQuitApp();
    }
  };

  private handleQuitApp = () => {
    const mainWindow = remote.getCurrentWindow();
    if (mainWindow.isVisible()) {
      this.taskFGM.setWindowBound(mainWindow.getBounds());
    }

    this.taskFGM.save();
    this.taskFGM.stop();
    window.removeEventListener('resize', this.handleResize);
    ipcRenderer.send('closed');
  };

  private handleHide = () => {
    const mainWindow = remote.getCurrentWindow();
    this.taskFGM.setWindowBound(mainWindow.getBounds());
  };

  private handleStart = () => {
    this.taskFGM.start();
  };

  private handlePause = () => {
    this.taskFGM.pause();
  };

  private handleStop = () => {
    this.taskFGM.stop();
  };

  private handleOpenSettings = () => {
    this.settingsDialogRef.current!.open(
      (launchAtLogon: boolean, watchMode: FGM_WATCH_MODE, closeToTray: boolean) => {
        this.taskFGM.setLaunchAtLogon(launchAtLogon);
        this.taskFGM.setWatchMode(watchMode);
        this.taskFGM.setCloseToTray(closeToTray);
        this.taskFGM.save();
      }
    );
  };

  private handleContextMenu = (e: any, item: any) => {
    e.preventDefault();

    const menu = React.createElement(
      Menu,
      { className: 'bp3-ui-text' }, // empty props
      React.createElement(MenuItem, {
        text: 'Delete',
        icon: 'delete',
        onClick: () => {
          this.yesNoDialogRef.current!.open('Delete item', 'Are you sure to delete?', () => {
            // onOk
            this.taskFGM.removeApp(item.key);
            this.taskFGM.save();
            this.listRef.current!.forceUpdate();
          });
        }
      }),
      React.createElement(MenuItem, {
        text: 'Properties...',
        icon: 'properties',
        onClick: () => {
          this.windowAppPropertyDialog.current!.open(this.listRef.current!.getSelectedItem());
        }
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
        this.taskFGM.addApp(item, wpos, wsize, width, height);
        this.taskFGM.save();
        this.listRef.current!.forceUpdate();
      }
    );
  };

  render() {
    Logger.logRenderInfo(this);

    const newState = this.props.stateFGM;
    let stateText: string = '';
    let stateColor: string = Colors.GRAY3;

    switch (newState) {
      case FGM_STATE.STARTED:
        stateText = 'started';
        stateColor = Colors.GREEN5;
        break;

      case FGM_STATE.PAUSED:
        stateText = 'paused';
        stateColor = Colors.GOLD3;
        break;

      case FGM_STATE.STOPPED:
        stateText = 'stopped';
        stateColor = Colors.GRAY3;
        break;
    }

    return (
      <>
        <TitleBar app='Frameless Game Mode' icon={`./appIcon.png`} theme={TitleBarTheme} />
        <AppLayout className='bp3-dark' bodyBackgroundColor={Colors.GOLD5}>
          <header>
            <Navbar style={{ height: 'auto', overflow: 'hidden' }}>
              <NavbarGroup align={Alignment.LEFT}>
                <NavbarHeading>Game List</NavbarHeading>
              </NavbarGroup>
              <NavbarGroup align={Alignment.RIGHT}>
                <NavbarDivider />
                <Button
                  disabled={this.props.stateFGM == FGM_STATE.STARTED}
                  className={Classes.MINIMAL}
                  icon='play'
                  onClick={this.handleStart}
                />
                <Button
                  disabled={
                    this.props.stateFGM == FGM_STATE.PAUSED ||
                    this.props.stateFGM == FGM_STATE.STOPPED
                  }
                  className={Classes.MINIMAL}
                  icon='pause'
                  onClick={this.handlePause}
                />
                <Button
                  disabled={this.props.stateFGM == FGM_STATE.STOPPED}
                  className={Classes.MINIMAL}
                  icon='stop'
                  onClick={this.handleStop}
                />
                <Button className={Classes.MINIMAL} icon='cog' onClick={this.handleOpenSettings} />
              </NavbarGroup>
            </Navbar>
          </header>
          <main>
            <WindowAppList
              listApp={this.props.listAppToMonitor}
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
            <WindowAppPropertyDialog ref={this.windowAppPropertyDialog} />
          </main>

          <footer className={`has-text-centered ${styles.footer}`}>
            <Icon className={styles.stateIcon} icon='record' iconSize={18} color={stateColor} />
            <p className={styles.stateText}>{stateText}</p>
          </footer>
        </AppLayout>
      </>
    );
  }
}

const mapStateToProps = (state: IAppState, ownProps?: any) => {
  Logger.log('mapStateToProps, state=', state, ', ownProps=', ownProps);
  return {
    listAppToMonitor: state.listAppToMonitor,
    stateFGM: state.stateFGM
  };
};

// export default connect(
//   mapStateToProps,
//   null,
//   null,
//   { pure: true }
// )(App);
export default connect(mapStateToProps)(App);
