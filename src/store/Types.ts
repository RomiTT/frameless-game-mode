import { FGM_STATE, FGM_WATCH_MODE } from '../lib/FGM';
import { Language } from '../lib/lang';

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
  readonly closeToTray: boolean;
  readonly windowBound: IWindowBound;
  readonly currentLanguage: Language;
}

export interface IReduxAction {
  type: string;
  reducer: (state: IAppState) => IAppState;
}

export interface IWindowApp {
  processPath: string;
  processName: string;
  title: string;
  key: string;
  windowArea: IWindowBound;
  clientArea: IWindowBound;
  style: number;
  exStyle: number;
}
