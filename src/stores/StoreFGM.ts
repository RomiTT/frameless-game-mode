import { observable, action, computed } from 'mobx';
import { persist } from 'mobx-persist';
import {
  FGM,
  FGM_STATE,
  FGM_WINDOW_POSITION,
  FGM_WINDOW_SIZE,
  FGM_MODE
} from '../components/FGM';

export interface IStoreFGM {
  intervalToUpdateList: number;
  listWindowApp: Array<Object>;
  state: FGM_STATE;
  mode: FGM_MODE;
  startOnLaunch: boolean;
  load(): void;
  setMode(mode: FGM_MODE): void;
  start(): void;
  pause(): void;
  stop(): void;
  updateWindowAppList(): void;
}

export class StoreFGM implements IStoreFGM {
  @persist @observable intervalToUpdateList: number = 300;
  @observable listWindowApp: Array<Object> = new Array<Object>();
  @observable state: FGM_STATE = FGM_STATE.STOPPED;
  @persist @observable mode: FGM_MODE = FGM_MODE.ALL_WINDOWS;
  @persist @observable startOnLaunch: boolean = true;

  constructor() {
    FGM.setEventListener('started', this.handleStarted);
    FGM.setEventListener('paused', this.handlePaused);
    FGM.setEventListener('stopped', this.handleStopped);
    FGM.setMode(this.mode);
    this.load();
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
    let arg = [
      {
        processName: 'D:\\Games\\Sekiro\\sekiro.exe',
        title: '',
        wpos: FGM_WINDOW_POSITION.MIDDLE_CENTER,
        wsize: FGM_WINDOW_SIZE.BASED_ON_CLIENT_AREA,
        width: 0,
        height: 0
      }
    ];

    FGM.setDataList(arg);
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
  updateWindowAppList = () => {
    FGM.getWindowAppList((list: Array<Object>) => {
      this.listWindowApp = list;
    });
  };
}
