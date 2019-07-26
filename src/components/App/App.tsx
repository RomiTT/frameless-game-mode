import AddWindowAppDialog from '../AddWindowAppDialog/AddWindowAppDialog';
import AppLayout from '../AppLayout/AppLayout';
import FloatingButton from '../FloatingButton';
import React from 'react';
import SettingsDialog from '../SettingsDialog/SettingsDialog';
import Tasks from '../../store/Tasks';
import WindowAppList from '../WindowAppList/WindowAppList';
import YesNoDialog from '../YesNoDialog/YesNoDialog';
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
  NavbarHeading,
  Spinner
} from '@blueprintjs/core';
import { connect } from 'react-redux';
import { FGM_STATE, FGM_WINDOW_POSITION, FGM_WINDOW_SIZE, FGM_WATCH_MODE } from '../../lib/FGM';
import { IAppState } from '../../store/Types';
import { TitleBar, TitleBarTheme } from '../FramelessTitleBar';
import store from '../../store/Store';
import Logger from '../../lib/Logger';
import WindowAppPropertyDialog from '../WindowAppPropertyDialog/WindowAppPropertyDialog';
import EditWindowAppDialog from '../EditWindowAppDialog/EditWindowAppDialog';
import AboutDialog from '../AboutDialog/AboutDialog';
import { AppToaster } from '../../lib/Toaster';
import AutoUpdater from '../../lib/AutoUpdater';
import AutoUpdateDialog from '../AutoUpdateDialog/AutoUpdateDialog';
import { Language, getLocaleNameFromLanguage } from '../../languages';
import styles from './App.module.scss';

const { remote, ipcRenderer } = require('electron');

interface IProps {
  listAppToMonitor: ReadonlyArray<object>;
  stateFGM: FGM_STATE;
  langData: any;
}

interface IState {
  addBtnLeftPos: number;
  checkUpdate: boolean;
}

class App extends React.PureComponent<IProps, IState> {
  private taskFGM = Tasks.FGM;
  private listRef: React.RefObject<WindowAppList> = React.createRef();
  private addAppDialogRef: React.RefObject<AddWindowAppDialog> = React.createRef();
  private yesNoDialogRef: React.RefObject<YesNoDialog> = React.createRef();
  private settingsDialogRef: React.RefObject<SettingsDialog> = React.createRef();
  private windowAppPropertyDialogRef: React.RefObject<WindowAppPropertyDialog> = React.createRef();
  private editWindowAppDialogRef: React.RefObject<EditWindowAppDialog> = React.createRef();
  private aboutDialogRef: React.RefObject<AboutDialog> = React.createRef();
  private autoUpdateDialogRef: React.RefObject<AutoUpdateDialog> = React.createRef();

  state = {
    addBtnLeftPos: 0,
    checkUpdate: false
  };

  componentDidMount() {
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

    this.addUpdateListeners(true);
    AutoUpdater.checkUpdate();
  }

  private renderCheckUpdateButton() {
    if (this.state.checkUpdate) {
      return (
        <div className={styles.spinner}>
          <Spinner intent='success' size={15} />
        </div>
      );
    }

    return (
      <div className={styles.notification} onClick={this.handleCheckUpdate}>
        <Icon icon='refresh' iconSize={12} />
      </div>
    );
  }

  private addUpdateListeners = (initialCheck: boolean) => {
    AutoUpdater.onUdateAvailable(this.handleUpdateAvailable);
    if (initialCheck === false) {
      AutoUpdater.onUpdateNotAvailable(this.handleUpdateNotAvailable);
    }
    AutoUpdater.onError(this.handleUpdateError);
  };

  private removeUpdateListeners = () => {
    AutoUpdater.removeUpdateAvailableListener(this.handleUpdateAvailable);
    AutoUpdater.removeUpdateNotAvailableListener(this.handleUpdateNotAvailable);
    AutoUpdater.removeErrorHandler(this.handleUpdateError);
  };

  private handleUpdateAvailable = (event: any, msg: string) => {
    Logger.log(msg);
    const mainWindow = remote.getCurrentWindow();
    if (mainWindow.isVisible() === false) {
      mainWindow.show();
    }

    const { updateAvailableToast } = this.props.langData;

    AppToaster.show({
      intent: 'primary',
      icon: 'info-sign',
      message: updateAvailableToast.message,
      timeout: 0,
      action: {
        onClick: () => {
          this.autoUpdateDialogRef.current!.open();
        },
        text: updateAvailableToast.actionName
      }
    });

    this.removeUpdateListeners();
    this.setState({ checkUpdate: false });
  };

  private handleUpdateNotAvailable = (event: any, msg: string) => {
    const { updateNotAvailableToast } = this.props.langData;

    Logger.log(msg);
    AppToaster.show({
      intent: 'primary',
      icon: 'info-sign',
      message: updateNotAvailableToast.message
    });

    this.removeUpdateListeners();
    this.setState({ checkUpdate: false });
  };

  private handleUpdateError = (event: any, error: any) => {
    Logger.log('Update error', error);
    AppToaster.show({
      intent: 'danger',
      icon: 'error',
      message: `${error.name} - ${error.statusCode}`,
      timeout: 5000
    });

    this.removeUpdateListeners();
    this.setState({ checkUpdate: false });
  };

  private handleCheckUpdate = () => {
    this.addUpdateListeners(false);
    AutoUpdater.checkUpdate();
    this.setState({ checkUpdate: true });
  };

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

  private handleOpenAbout = () => {
    this.aboutDialogRef.current!.open();
  };

  private handleContextMenu = (e: any, item: any) => {
    e.preventDefault();

    const { contextMenu } = this.props.langData;

    const menu = React.createElement(
      Menu,
      { className: 'bp3-ui-text' }, // empty props
      React.createElement(MenuItem, {
        text: contextMenu.edit,
        icon: 'page-layout',
        onClick: () => {
          const selectedItem: any = this.listRef.current!.getSelectedItem();
          this.editWindowAppDialogRef.current!.open(selectedItem, (item: any) => {
            if (
              selectedItem.wpos !== item.wpos ||
              selectedItem.wsize !== item.wsize ||
              (selectedItem.wsize == FGM_WINDOW_SIZE.CUSTOM_SIZE &&
                (selectedItem.width != item.width || selectedItem.height !== item.height))
            ) {
              Logger.log('editApp');
              this.taskFGM.editApp(selectedItem, item.wpos, item.wsize, item.width, item.height);
            }
          });
        }
      }),
      React.createElement(MenuItem, {
        text: contextMenu.delete,
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
        text: contextMenu.properties,
        icon: 'properties',
        onClick: () => {
          this.windowAppPropertyDialogRef.current!.open(this.listRef.current!.getSelectedItem());
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
    const { mainWindow } = this.props.langData;

    const newState = this.props.stateFGM;
    let stateText: string = '';
    let stateColor: string = Colors.GRAY3;

    switch (newState) {
      case FGM_STATE.STARTED:
        stateText = mainWindow.stateStarted;
        stateColor = Colors.GREEN5;
        break;

      case FGM_STATE.PAUSED:
        stateText = mainWindow.statePaused;
        stateColor = Colors.GOLD3;
        break;

      case FGM_STATE.STOPPED:
        stateText = mainWindow.stateStopped;
        stateColor = Colors.GRAY3;
        break;
    }

    return (
      <>
        <TitleBar app='Frameless Game Mode' icon={`./appIcon.png`} theme={TitleBarTheme} />
        <AppLayout className='bp3-dark'>
          <header>
            <Navbar style={{ height: 'auto', overflow: 'hidden' }}>
              <NavbarGroup align={Alignment.LEFT}>
                <NavbarHeading>{mainWindow.headerName}</NavbarHeading>
                <Button
                  className={Classes.MINIMAL}
                  icon='info-sign'
                  onClick={this.handleOpenAbout}
                />
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
                <NavbarDivider />
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
            <AddWindowAppDialog ref={this.addAppDialogRef} />
            <SettingsDialog ref={this.settingsDialogRef} />
            <WindowAppPropertyDialog ref={this.windowAppPropertyDialogRef} />
            <EditWindowAppDialog ref={this.editWindowAppDialogRef} />
            <AboutDialog ref={this.aboutDialogRef} />
            <AutoUpdateDialog ref={this.autoUpdateDialogRef} />
            <YesNoDialog ref={this.yesNoDialogRef} />
          </main>

          <footer className={`has-text-centered ${styles.footer}`}>
            <Icon className={styles.stateIcon} icon='record' iconSize={18} color={stateColor} />
            <p className={styles.stateText}>{stateText}</p>
            <div className={styles.notificationsContainer}>{this.renderCheckUpdateButton()}</div>
          </footer>
        </AppLayout>
      </>
    );
  }
}

const mapStateToProps = (state: IAppState, ownProps?: any) => {
  Logger.log('mapStateToProps, state=', state, ', ownProps=', ownProps);

  const localeName = getLocaleNameFromLanguage(state.currentLanguage);
  const langData: any = require(`./languages/${localeName}.json`);
  return {
    listAppToMonitor: state.listAppToMonitor,
    stateFGM: state.stateFGM,
    langData: langData
  };
};

// export default connect(
//   mapStateToProps,
//   null,
//   null,
//   { pure: true }
// )(App);
export default connect(mapStateToProps)(App);
