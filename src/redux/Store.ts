import { createStore } from 'redux';
import { appState, AppState } from './AppState';
import { ReduxAction, Actions } from './Actions';

const createReduxStore = new Function(
  'createStore',
  'reducer',
  `
  return createStore(
    reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );
`
);

const reducer = (state = appState, action: ReduxAction) => {
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
  const store = createReduxStore(createStore, reducer);
  initActions(store);
  return store;
}

export default initialize();
