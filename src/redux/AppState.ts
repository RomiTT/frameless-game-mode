import { FGM_STATE, FGM_WATCH_MODE } from '../components/FGM';

export interface WindowBound {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface AppState {
  readonly listAppToMonitor: Array<object>;
  readonly state: FGM_STATE;
  readonly mode: FGM_WATCH_MODE;
  readonly launchAtLogon: boolean;
  readonly windowBound: WindowBound;
}

export const appState: AppState = {
  listAppToMonitor: new Array<object>(),
  state: FGM_STATE.STOPPED,
  mode: FGM_WATCH_MODE.ALL_WINDOWS,
  launchAtLogon: false,
  windowBound: { x: 0, y: 0, width: 0, height: 0 }
};
