import store, { isSerializable } from './Store';
import Actions from './Actions';
import {
  FGM,
  FGM_WATCH_MODE,
  FGM_WINDOW_POSITION,
  FGM_WINDOW_SIZE
} from '../lib/FGM';
import { IWindowBound } from './Types';
import { LaunchAtLogon, schedulerName, appArgs } from '../lib/LaunchAtLogon';

class FGMTask {
  constructor() {
    FGM.setEventListener('started', this.onStarted);
    FGM.setEventListener('paused', this.onPaused);
    FGM.setEventListener('stopped', this.onStopped);
  }

  private onStarted = (msg: string) => {
    console.log(`%c${msg}`, 'font-size:2em; color:red;');
    Actions.setFGMState(FGM.state());
  };

  private onPaused = (msg: string) => {
    console.log(`%c${msg}`, 'font-size:2em; color:red;');
    Actions.setFGMState(FGM.state());
  };

  private onStopped = (msg: string) => {
    console.log(`%c${msg}`, 'font-size:2em; color:red;');
    Actions.setFGMState(FGM.state());
  };

  load = async () => {
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

    const result = await LaunchAtLogon.get(schedulerName);
    newState['launchAtLogon'] = result;
    console.log('LaunchAtLogon.get() => ', result);

    Actions.loadAppState(newState);
    state = store.getState();
    FGM.setDataList(state.listAppToMonitor);
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
    const appState = store.getState();
    const index = appState.listAppToMonitor.findIndex(obj => {
      return (obj as any).key === item.key;
    });

    if (index > -1) {
      return;
    }

    const newAppInfo = {
      ...item,
      wpos: pos,
      wsize: size,
      width: width,
      height: height
    };
    FGM.addGameModeInfo(newAppInfo);
    Actions.addAppToList(newAppInfo);
  };

  removeApp = (key: string) => {
    FGM.removeGameModeInfo(key);
    Actions.removeAppFromList(key);
  };

  setWatchMode = (mode: FGM_WATCH_MODE) => {
    FGM.setMode(mode);
    Actions.setWatchMode(mode);
  };

  setLaunchAtLogon = async (val: boolean) => {
    await LaunchAtLogon.set(val, schedulerName, process.execPath, appArgs);
    const result = await LaunchAtLogon.get(schedulerName);
    Actions.setLaunchAtLogon(result);
    console.log('LaunchAtLogon.get() => ', result);
  };

  setCloseToTray = (val: boolean) => {
    Actions.setCloseToTray(val);
  };

  setWindowBound = (bound: IWindowBound) => {
    Actions.setWindowBound(bound);
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

  getWindowAppList = (callback: Function) => {
    // FGM.getWindowAppList((list: Array<object>) => {
    //   //callback(list);
    //   console.log('GetWindowAppList: ', list);
    // });

    FGM.getWindowAppList().then((list: any) => {
      console.log('GetWindowAppList: ', list);
      callback(list);
    });
  };
}

const Tasks = {
  FGM: new FGMTask()
};

export default Tasks;
