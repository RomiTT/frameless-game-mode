import { AppState, WindowBound } from './AppState';
import produce from 'immer';
import {
  FGM_STATE,
  FGM_WATCH_MODE,
  FGM_WINDOW_POSITION,
  FGM_WINDOW_SIZE
} from '../components/FGM';

export interface ReduxAction {
  type: string;
  reducer: (state: AppState) => AppState;
}

export const Actions = {
  setAppListToMonitor: (val: Array<object>) => ({
    type: 'ACTION_SET_APP_LIST_TO_MONITOR',
    reducer: (state: AppState) => {
      if (state.listAppToMonitor === val) return state;
      return produce(state, draft => {
        draft.listAppToMonitor = val;
      });
    }
  }),
  addAppToList: (
    item: any,
    pos: FGM_WINDOW_POSITION,
    size: FGM_WINDOW_SIZE,
    width: number,
    height: number
  ) => ({
    type: 'ACTION_ADD_APP_TO_LIST',
    reducer: (state: AppState) => {
      return produce(state, draft => {
        draft.listAppToMonitor.push({
          ...item,
          wpos: pos,
          wsize: size,
          width: width,
          height: height
        });
      });
    }
  }),
  removeAppFromList: (key: string) => ({
    type: 'ACTION_REMOVE_APP_FROM_LIST',
    reducer: (state: AppState) => {
      const index = state.listAppToMonitor.findIndex(item => {
        return (item as any).key === key;
      });

      if (index > -1) {
        return produce(state, draft => {
          draft.listAppToMonitor.splice(index, 1);
        });
      }
      return state;
    }
  }),

  setFGMState: (val: FGM_STATE) => ({
    type: 'ACTION_SET_FGM_STATE',
    reducer: (state: AppState) => {
      if (state.state === val) return state;
      return produce(state, draft => {
        draft.state = val;
      });
    }
  }),
  setWatchMode: (val: FGM_WATCH_MODE) => ({
    TYPE: 'ACTION_SET_WATCH_MODE',
    reducer: (state: AppState) => {
      if (state.mode === val) return state;
      return produce(state, draft => {
        draft.mode = val;
      });
    }
  }),
  setLaunchAtLogon: (val: boolean) => ({
    type: 'ACTION_SET_LAUNCH_AT_LOGON',
    reducer: (state: AppState) => {
      if (state.launchAtLogon === val) return state;
      return produce(state, draft => {
        draft.launchAtLogon = val;
      });
    }
  }),
  setWindowBound: (val: WindowBound) => ({
    type: 'ACTION_SET_WINDOW_BOUND',
    reducer: (state: AppState) => {
      if (state.windowBound === val) return state;
      return produce(state, draft => {
        draft.windowBound = val;
      });
    }
  })
};
