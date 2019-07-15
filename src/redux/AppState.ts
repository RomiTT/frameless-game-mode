import { FGM_STATE, FGM_WATCH_MODE } from '../components/FGM';
import { serialize } from './SerializeObject';

export interface WindowBound {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface IAppState {
  readonly listAppToMonitor: ReadonlyArray<object>;
  readonly state: FGM_STATE;
  readonly mode: FGM_WATCH_MODE;
  readonly launchAtLogon: boolean;
  readonly windowBound: WindowBound;
}

class AppState implements IAppState {
  @serialize listAppToMonitor = new Array<object>();
  state = FGM_STATE.STOPPED;
  @serialize mode = FGM_WATCH_MODE.ALL_WINDOWS;
  @serialize launchAtLogon = false;
  @serialize windowBound = { x: 0, y: 0, width: 0, height: 0 };
}

export const appState = new AppState() as IAppState;
