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
  FGM_MODE
} from '../components/FGM';
import { string } from 'prop-types';

export interface IStoreFGM {
  listAppToMonitor: Array<object>;
  state: FGM_STATE;
  mode: FGM_MODE;
  startOnLaunch: boolean;
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
  setMode(mode: FGM_MODE): void;
  start(): void;
  pause(): void;
  stop(): void;
  getWindowAppList(callback: Function): void;
}

export class StoreFGM implements IStoreFGM {
  @serialize @observable listAppToMonitor = new Array<object>();
  @observable state = FGM_STATE.STOPPED;
  @serialize @observable mode = FGM_MODE.ALL_WINDOWS;
  @serialize @observable startOnLaunch = true;

  constructor() {
    FGM.setEventListener('started', this.handleStarted);
    FGM.setEventListener('paused', this.handlePaused);
    FGM.setEventListener('stopped', this.handleStopped);
    FGM.setMode(this.mode);
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
    this.save();
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
    this.save();
  };

  @action
  setMode = (mode: FGM_MODE) => {
    FGM.setMode(mode);
    this.mode = mode;
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
