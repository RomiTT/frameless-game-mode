import { createStore } from 'redux';
import { appState, IAppState } from './AppState';
import { IReduxAction, Actions } from './Actions';
const isDev = require('electron-is-dev');

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
  let store: object | null = null;
  if (isDev) store = createStoreWithDevTools(createStore, reducer);
  else store = createStore(reducer);

  initActions(store);
  return store;
}

export default initialize();
