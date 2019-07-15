import { WindowBound, appState } from './AppState';
import { Actions } from './Actions';
import {
  FGM,
  FGM_WINDOW_POSITION,
  FGM_WINDOW_SIZE,
  FGM_WATCH_MODE
} from '../components/FGM';
import { deserializeObject, serializeObject } from './SerializeObject';

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

  load = () => {
    Actions.loadAppState(deserializeObject(appState));
  };

  save = () => {
    serializeObject(appState);
  };

  addApp = (
    item: any,
    pos: FGM_WINDOW_POSITION,
    size: FGM_WINDOW_SIZE,
    width: number,
    height: number
  ) => {
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

  setLaunchAtLogon = (val: boolean) => {
    //FGM.setLaunchAtLogon(val);
    Actions.setLaunchAtLogon(val);
  };

  setWindowBound = (bound: WindowBound) => {
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
    FGM.getWindowAppList((list: Array<object>) => {
      callback(list);
    });
  };
}

const Tasks = {
  FGM: new FGMTask()
};

export default Tasks;
