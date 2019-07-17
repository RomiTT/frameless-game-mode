import Actions from './Actions';
import { createStore, Store, bindActionCreators } from 'redux';
import { FGM_STATE, FGM_WATCH_MODE } from '../lib/FGM';
import { IAppState, IReduxAction } from './Types';
const isDev = require('electron-is-dev');

const appState: IAppState = {
  listAppToMonitor: new Array<object>(),
  stateFGM: FGM_STATE.STOPPED,
  watchMode: FGM_WATCH_MODE.ALL_WINDOWS,
  launchAtLogon: false,
  closeToTray: false,
  windowBound: { x: 0, y: 0, width: 0, height: 0 }
};

const blackList = ['stateFGM', 'launchAtLogon'];
export function isSerializable(key: string) {
  for (let name of blackList) {
    if (name === key) {
      return false;
    }
  }

  return true;
}

const reducer = (state = appState, action: IReduxAction) => {
  if (action.reducer) {
    return action.reducer(state);
  }
  return state;
};

function initActions(store: any) {
  const dispatch = store.dispatch;
  for (let [key, value] of Object.entries(Actions)) {
    Object.defineProperty(Actions, key, {
      value: bindActionCreators(value, dispatch),
      // value: function() {
      //   const action = value as Function;
      //   dispatch(action.apply(null, arguments));
      // },
      writable: false
    });
  }
}

function initialize() {
  let store: Store<IAppState, IReduxAction> | null = null;
  if (isDev) {
    const win: any = window;
    const ext = win.__REDUX_DEVTOOLS_EXTENSION__ && win.__REDUX_DEVTOOLS_EXTENSION__();
    store = createStore(reducer, ext);
  } else {
    store = createStore(reducer);
  }

  initActions(store);
  return store;
}

const store = initialize()!;
export default store;
