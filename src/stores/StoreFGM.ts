import { observable, action, computed } from 'mobx';
import {
  serialize,
  serializeObject,
  deserializeObject,
  serializeF
} from './SerializeObject';
import {
  FGM,
  FGM_STATE,
  FGM_WINDOW_POSITION,
  FGM_WINDOW_SIZE,
  FGM_WATCH_MODE
} from '../components/FGM';
const app: any = require('electron').remote.app;

export interface IStoreFGM {
  readonly listAppToMonitor: Array<object>;
  readonly state: FGM_STATE;
  readonly mode: FGM_WATCH_MODE;
  readonly launchAtLogin: boolean;
  load(): void;
  save(): void;
  addApp(
    item: any,
    pos: FGM_WINDOW_POSITION,
    size: FGM_WINDOW_SIZE,
    width: number,
    height: number
  ): void;
  removeApp(key: string): void;
  setWatchMode(mode: FGM_WATCH_MODE): void;
  setAutoLaunch(val: boolean): void;
  start(): void;
  pause(): void;
  stop(): void;
  getWindowAppList(callback: Function): void;
}

export class StoreFGM implements IStoreFGM {
  @serialize @observable listAppToMonitor = new Array<object>();
  @observable state = FGM_STATE.STOPPED;
  @serialize @observable mode = FGM_WATCH_MODE.ALL_WINDOWS;
  @serialize @observable launchAtLogin = false;

  constructor() {
    FGM.setEventListener('started', this.handleStarted);
    FGM.setEventListener('paused', this.handlePaused);
    FGM.setEventListener('stopped', this.handleStopped);
    FGM.setMode(this.mode);

    const settings = app.getLoginItemSettings();
    this.launchAtLogin = settings.openAtLogin;
    console.debug('app settings-', settings);
  }

  private handleStarted = (msg: string) => {
    console.log(`%c${msg}`, 'font-size:2em; color:red;');
    this.state = FGM.state();
  };

  private handlePaused = (msg: string) => {
    console.log(`%c${msg}`, 'font-size:2em; color:red;');
    this.state = FGM.state();
  };

  private handleStopped = (msg: string) => {
    console.log(`%c${msg}`, 'font-size:2em; color:red;');
    this.state = FGM.state();
  };

  private enableAutoLaunch = () => {
    let settings = app.getLoginItemSettings();
    if (settings.openAtLogin) return;

    app.setLoginItemSettings({ openAtLogin: true });
    settings = app.getLoginItemSettings();
    this.launchAtLogin = settings.openAtLogin;
  };

  private disableAutoLaunch = () => {
    let settings = app.getLoginItemSettings();
    if (settings.openAtLogin === false) return;

    app.setLoginItemSettings({ openAtLogin: false });
    settings = app.getLoginItemSettings();
    this.launchAtLogin = settings.openAtLogin;
  };

  @action
  load = () => {
    deserializeObject(this);
    FGM.setDataList(this.listAppToMonitor);
  };

  @action
  save = () => {
    serializeObject(this);
  };

  @action
  addApp = (
    item: any,
    pos: FGM_WINDOW_POSITION,
    size: FGM_WINDOW_SIZE,
    width: number,
    height: number
  ) => {
    const index = this.listAppToMonitor.findIndex(obj => {
      return (obj as any).key === item.key;
    });

    if (index > -1) {
      return;
    }

    let val = {
      ...item,
      wpos: pos,
      wsize: size,
      width: width,
      height: height
    };
    this.listAppToMonitor.push(val);
    FGM.addGameModeInfo(val);
  };

  @action
  removeApp = (key: string) => {
    const index = this.listAppToMonitor.findIndex(item => {
      return (item as any).key === key;
    });

    if (index > -1) {
      this.listAppToMonitor.splice(index, 1);
    }

    FGM.removeGameModeInfo(key);
  };

  @action
  setWatchMode = (mode: FGM_WATCH_MODE) => {
    if (this.mode === mode) {
      return;
    }

    FGM.setMode(mode);
    this.mode = mode;
  };

  @action
  setAutoLaunch = (val: boolean) => {
    if (this.launchAtLogin === val) {
      return;
    }

    this.launchAtLogin = val;
    if (val) {
      this.enableAutoLaunch();
    } else {
      this.disableAutoLaunch();
    }
  };

  @action
  start = () => {
    FGM.start();
  };

  @action
  pause = () => {
    FGM.pause();
  };

  @action
  stop = () => {
    FGM.stop();
  };

  @action
  getWindowAppList = (callback: Function) => {
    FGM.getWindowAppList((list: Array<object>) => {
      callback(list);
    });
  };
}
