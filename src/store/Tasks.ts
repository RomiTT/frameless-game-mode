import store, { isSerializable } from './Store';
import Actions from './Actions';
import { FGM, FGM_WATCH_MODE, FGM_WINDOW_POSITION, FGM_WINDOW_SIZE } from '../lib/FGM';
import { IWindowBound, IWindowApp } from './Types';
import { LaunchAtLogon, schedulerName, appArgs } from '../lib/LaunchAtLogon';
import Logger from '../lib/Logger';
import { Language, getLanguageName } from '../lib/lang';

class FGMTask {
  constructor() {
    FGM.setEventListener('started', this.onStarted);
    FGM.setEventListener('paused', this.onPaused);
    FGM.setEventListener('stopped', this.onStopped);
  }

  private onStarted = (msg: string) => {
    Logger.log(`%c${msg}`, 'font-size:2em; color:red;');
    Actions.setFGMState(FGM.state());
  };

  private onPaused = (msg: string) => {
    Logger.log(`%c${msg}`, 'font-size:2em; color:red;');
    Actions.setFGMState(FGM.state());
  };

  private onStopped = (msg: string) => {
    Logger.log(`%c${msg}`, 'font-size:2em; color:red;');
    Actions.setFGMState(FGM.state());
  };

  load = async () => {
    try {
      const localStorage = window.localStorage;
      let state = store.getState();
      const newState: any = {};
      for (let [key, value] of Object.entries(state)) {
        let itemVal = localStorage.getItem(key);
        if (itemVal) {
          Object.defineProperty(newState, key, {
            value: JSON.parse(itemVal),
            writable: true
          });
        }
      }

      Actions.loadAppState(newState);
      state = store.getState();
      FGM.setDataList(state.listAppToMonitor);

      const result = await LaunchAtLogon.get(schedulerName);
      Actions.setLaunchAtLogon(result);
    } catch (err) {
      Logger.log(err);
    }
  };

  save = () => {
    const localStorage = window.localStorage;
    const state = store.getState();

    for (let [key, value] of Object.entries(state)) {
      if (isSerializable(key)) {
        localStorage.setItem(key, JSON.stringify(value));
      }
    }
  };

  addApp = (
    item: any,
    pos: FGM_WINDOW_POSITION,
    size: FGM_WINDOW_SIZE,
    width: number,
    height: number
  ) => {
    const index = store.getState().listAppToMonitor.findIndex(obj => {
      return (obj as any).key === item.key;
    });

    if (index > -1) {
      return;
    }

    const newAppInfo = {
      processPath: item.processPath,
      processName: item.processName,
      title: item.title,
      key: item.key,
      wpos: pos,
      wsize: size,
      width: width,
      height: height
    };
    FGM.addGameModeInfo(newAppInfo);
    Actions.addAppToList(newAppInfo);
  };

  editApp = (
    item: any,
    pos: FGM_WINDOW_POSITION,
    size: FGM_WINDOW_SIZE,
    width: number,
    height: number
  ) => {
    const itemToEdit = {
      processPath: item.processPath,
      processName: item.processName,
      title: item.title,
      key: item.key,
      wpos: pos,
      wsize: size,
      width: width,
      height: height
    };

    FGM.editGameModeInfo(itemToEdit);
    //FGM.forceApplyGameModeInfo(itemToEdit.key);
    Actions.editApp(itemToEdit);
  };

  removeApp = (key: string) => {
    FGM.removeGameModeInfo(key);
    Actions.removeAppFromList(key);
  };

  setWatchMode = (mode: FGM_WATCH_MODE) => {
    if (mode === store.getState().watchMode) return;

    FGM.setMode(mode);
    Actions.setWatchMode(mode);
  };

  setLaunchAtLogon = async (val: boolean) => {
    if (val === store.getState().launchAtLogon) return;

    try {
      await LaunchAtLogon.set(val, schedulerName, process.execPath, appArgs);
      const result = await LaunchAtLogon.get(schedulerName);
      Actions.setLaunchAtLogon(result);
    } catch (err) {
      Logger.log(err);
    }
  };

  setCloseToTray = (val: boolean) => {
    if (val === store.getState().closeToTray) return;

    Actions.setCloseToTray(val);
  };

  setWindowBound = (bound: IWindowBound) => {
    const winBound = store.getState().windowBound;
    if (
      bound.x === winBound.x &&
      bound.y === winBound.y &&
      bound.width === winBound.width &&
      bound.height === winBound.height
    )
      return;

    Actions.setWindowBound(bound);
  };

  setLanguage = (language: Language) => {
    Logger.log('language:', getLanguageName(language));
    //Logger.log('currentLanguage:', getLanguageName(this.appState.currentLanguage));
    if (language === store.getState().currentLanguage) return;

    Actions.setLanguage(language);
  };

  start = () => {
    FGM.start();
  };

  pause = () => {
    FGM.pause();
  };

  stop = () => {
    FGM.stop();
  };

  getWindowAppList = async () => {
    try {
      const list = await FGM.getWindowAppList();
      Logger.log(list);
      return list;
    } catch (err) {
      Logger.log(err);
    }

    return null;
  };
}

const Tasks = {
  FGM: new FGMTask()
};

export default Tasks;
