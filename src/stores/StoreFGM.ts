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

export interface IStoreFGM {
  listAppToMonitor: Array<object>;
  state: FGM_STATE;
  mode: FGM_MODE;
  startOnLaunch: boolean;
  load(): void;
  save(): void;
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

  handleStarted = (msg: string) => {
    console.log(`%c${msg}`, 'font-size:2em; color:red;');
    this.state = FGM.state();
  };

  handlePaused = (msg: string) => {
    console.log(`%c${msg}`, 'font-size:2em; color:red;');
    this.state = FGM.state();
  };

  handleStopped = (msg: string) => {
    console.log(`%c${msg}`, 'font-size:2em; color:red;');
    this.state = FGM.state();
  };

  load = () => {
    deserializeObject(this);
    FGM.setDataList(this.listAppToMonitor);
  };

  save = () => {
    serializeObject(this);
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
