import { createStore, Store } from 'redux';
import { Actions } from './Actions';
import { FGM_STATE, FGM_WATCH_MODE } from '../components/FGM';
import { serialize } from './SerializeObject';
import { IAppState, IReduxAction } from './Types';
const isDev = require('electron-is-dev');

class AppState implements IAppState {
  @serialize listAppToMonitor = new Array<object>();
  state = FGM_STATE.STOPPED;
  @serialize mode = FGM_WATCH_MODE.ALL_WINDOWS;
  @serialize launchAtLogon = false;
  @serialize windowBound = { x: 0, y: 0, width: 0, height: 0 };
}

const appState = new AppState() as IAppState;

const createStoreWithDevTools = new Function(
  'createStore',
  'reducer',
  `
  return createStore(
    reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );
`
);

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
      // value: bindActionCreators(value, dispatch),
      value: function() {
        const action = value as Function;
        dispatch(action.apply(null, arguments));
      },
      writable: false
    });
  }
}

function initialize() {
  let store: Store<IAppState, IReduxAction> | null = null;
  if (isDev) store = createStoreWithDevTools(createStore, reducer);
  else store = createStore(reducer);

  initActions(store);
  return store;
}

const store = initialize()!;
export default store;
