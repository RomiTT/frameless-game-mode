import { AppState, WindowBound } from './AppState';
import { Actions } from './Actions';
import {
  FGM,
  FGM_STATE,
  FGM_WINDOW_POSITION,
  FGM_WINDOW_SIZE,
  FGM_WATCH_MODE
} from '../components/FGM';
import { PAUSE } from '@blueprintjs/icons/lib/esm/generated/iconContents';

const Tasks = {
  FGM: {
    init: () => {
      FGM.setEventListener('started', (msg: string) => {
        console.log(`%c${msg}`, 'font-size:2em; color:red;');
        Actions.setFGMState(FGM.state());
      });
      FGM.setEventListener('paused', (msg: string) => {
        console.log(`%c${msg}`, 'font-size:2em; color:red;');
        Actions.setFGMState(FGM.state());
      });
      FGM.setEventListener('stopped', (msg: string) => {
        console.log(`%c${msg}`, 'font-size:2em; color:red;');
        Actions.setFGMState(FGM.state());
      });
    },
    load: () => {},
    save: () => {},
    addApp: (
      item: any,
      pos: FGM_WINDOW_POSITION,
      size: FGM_WINDOW_SIZE,
      width: number,
      height: number
    ) => {},
    removeApp: (key: string) => {},
    setWatchMode: (mode: FGM_WATCH_MODE) => {},
    setAutoLaunch: (val: boolean) => {},
    setWindowBound: (windowBound: WindowBound) => {},
    start: () => {
      FGM.start();
    },
    pause: () => {
      FGM.pause();
    },
    stop: () => {
      FGM.stop();
    },
    getWindowAppList: (callback: Function) => {}
  }
};

export default Tasks;
