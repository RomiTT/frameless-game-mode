import produce from 'immer';
import { FGM_STATE, FGM_WATCH_MODE } from '../lib/FGM';
import { IAppState, IWindowBound } from './Types';
import { Language } from '../languages';

const Actions = {
  loadAppState: (val: object) => ({
    type: 'ACTION_LOAD_APP_STATE',
    reducer: (state: IAppState) => {
      return produce(state, draft => {
        for (let [key, value] of Object.entries(draft)) {
          if (key in val) {
            const destObj = draft as any;
            const srcObj = val as any;
            if (destObj[key].constructor === value.constructor) destObj[key] = srcObj[key];
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

  editApp: (itemToEdit: any) => ({
    type: 'ACTION_EDIT_APP',
    reducer: (state: IAppState) => {
      const index = state.listAppToMonitor.findIndex(item => {
        return (item as any).key === itemToEdit.key;
      });

      if (index > -1) {
        return produce(state, draft => {
          draft.listAppToMonitor[index] = itemToEdit;
        });
      }

      return state;
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

  setWatchMode: (val: FGM_WATCH_MODE) => {
    return {
      type: 'ACTION_SET_WATCH_MODE',
      reducer: (state: IAppState) => {
        return produce(state, draft => {
          draft.watchMode = val;
        });
      }
    };
  },

  setLaunchAtLogon: (val: boolean) => ({
    type: 'ACTION_SET_LAUNCH_AT_LOGON',
    reducer: (state: IAppState) => {
      return produce(state, draft => {
        draft.launchAtLogon = val;
      });
    }
  }),

  setCloseToTray: (val: boolean) => ({
    type: 'ACTION_SET_CLOSE_TO_TRAY',
    reducer: (state: IAppState) => {
      return produce(state, draft => {
        draft.closeToTray = val;
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
  }),

  setLanguage: (val: Language) => ({
    type: 'ACTION_SET_LANGUAGE',
    reducer: (state: IAppState) => {
      return produce(state, draft => {
        draft.currentLanguage = val;
      });
    }
  })
};

export default Actions;
