import { AppState } from './AppState';
import produce from 'immer';

export interface ReduxAction {
  type: string;
  reducer: (state: AppState) => AppState;
}

export const Actions = {
  setLaunchAtLogon: (val: boolean) => ({
    type: 'SET_LAUNCH_AT_LOGON',
    reducer: (state: AppState) => {
      return produce(state, draft => {
        draft.launchAtLogon = val;
      });
    }
  })
};
