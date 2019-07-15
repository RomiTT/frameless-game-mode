import produce from 'immer';
import { FGM_STATE, FGM_WATCH_MODE } from '../components/FGM';
import { IAppState, IWindowBound } from './Types';

const Actions = {
  loadAppState: (val: object) => ({
    type: 'ACTION_LOAD_APP_STATE',
    reducer: (state: IAppState) => {
      return produce(state, draft => {
        for (let [key, value] of Object.entries(draft)) {
          if (key in val) {
            const destObj = draft as any;
            const srcObj = val as any;
            if (destObj[key].constructor === value.constructor)
              destObj[key] = srcObj[key];
          }
        }
      });
    }
  }),

  addAppToList: (item: any) => ({
    type: 'ACTION_ADD_APP_TO_LIST',
    reducer: (state: IAppState) => {
      return produce(state, draft => {
        draft.listAppToMonitor.push(item);
      });
    }
  }),

  removeAppFromList: (key: string) => ({
    type: 'ACTION_REMOVE_APP_FROM_LIST',
    reducer: (state: IAppState) => {
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

  setFGMState: (val: FGM_STATE) => {
    return {
      type: 'ACTION_SET_FGM_STATE',
      reducer: (state: IAppState) => {
        return produce(state, draft => {
          draft.stateFGM = val;
        });
      }
    };
  },

  setWatchMode: (val: FGM_WATCH_MODE) => ({
    TYPE: 'ACTION_SET_WATCH_MODE',
    reducer: (state: IAppState) => {
      return produce(state, draft => {
        draft.watchMode = val;
      });
    }
  }),

  setLaunchAtLogon: (val: boolean) => ({
    type: 'ACTION_SET_LAUNCH_AT_LOGON',
    reducer: (state: IAppState) => {
      return produce(state, draft => {
        draft.launchAtLogon = val;
      });
    }
  }),

  setWindowBound: (val: IWindowBound) => ({
    type: 'ACTION_SET_WINDOW_BOUND',
    reducer: (state: IAppState) => {
      return produce(state, draft => {
        draft.windowBound = val;
      });
    }
  })
};

export default Actions;