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
import { string } from 'prop-types';

export interface IStoreFGM {
  readonly listAppToMonitor: Array<object>;
  readonly state: FGM_STATE;
  readonly mode: FGM_WATCH_MODE;
  readonly autoLaunchOnSystemBoot: boolean;
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
  @serialize @observable autoLaunchOnSystemBoot = false;

  appInfo = {
    name: 'Frameless Game Mode',
    path: process.execPath
  };

  constructor() {
    FGM.setEventListener('started', this.handleStarted);
    FGM.setEventListener('paused', this.handlePaused);
    FGM.setEventListener('stopped', this.handleStopped);
    FGM.setMode(this.mode);

    const AutoLaunch = require('auto-launch');
    AutoLaunch.isEnabled().then((isEnabled: boolean) => {
      this.autoLaunchOnSystemBoot = isEnabled;
    });
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
    const isDev = require('electron-is-dev');
    if (isDev) {
      console.log('enableAutoLaunch: ', this.appInfo);
      return;
    }
    const AutoLaunch = require('auto-launch');
    const autoRunInfo = new AutoLaunch(this.appInfo);
    autoRunInfo.enable();
  };

  private disableAutoLaunch = () => {
    const isDev = require('electron-is-dev');
    if (isDev) {
      console.log('disableAutoLaunch: ', this.appInfo);
      return;
    }

    const AutoLaunch = require('auto-launch');
    const autoRunInfo = new AutoLaunch(this.appInfo);
    autoRunInfo.disable();
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
    if (this.autoLaunchOnSystemBoot === val) {
      return;
    }

    this.autoLaunchOnSystemBoot = val;
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
