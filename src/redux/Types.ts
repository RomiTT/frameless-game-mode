import { FGM_STATE, FGM_WATCH_MODE } from '../components/FGM';

export interface IWindowBound {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface IAppState {
  readonly listAppToMonitor: ReadonlyArray<object>;
  readonly stateFGM: FGM_STATE;
  readonly watchMode: FGM_WATCH_MODE;
  readonly launchAtLogon: boolean;
  readonly windowBound: IWindowBound;
}

export interface IReduxAction {
  type: string;
  reducer: (state: IAppState) => IAppState;
}
