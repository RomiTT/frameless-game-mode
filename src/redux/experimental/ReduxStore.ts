import { createReduxStore } from './CreateStore';
import { appState, AppState } from './AppState';
import { ReduxAction, Actions } from './Actions';
import { bindActionCreators, Action } from 'redux';

export type ActionListener = (state: AppState) => void;

let listenersToActions: any = {};
let listenersToAllAction = new Array<ActionListener>();

export function addActionListener(type: string, handler: ActionListener) {
  let listeners: Array<ActionListener> | null = null;
  if (type === 'ALL_ACTION') {
    listeners = listenersToAllAction;
  } else {
    listeners = listenersToActions[type];
    if (listeners) {
      listenersToActions[type] = new Array<ActionListener>();
    }
  }

  if (listeners) {
    listeners.push(handler);
  }
}

export function removeActionListener(type: string, handler: ActionListener) {
  let listeners: Array<ActionListener> | null = null;
  if (type === 'ALL_ACTION') {
    listeners = listenersToAllAction;
  } else {
    listeners = listenersToActions[type];
  }

  if (listeners) {
    const index = listeners.findIndex(item => {
      return item === handler;
    });

    if (index > -1) {
      listeners.splice(index, 1);
    }
  }
}

function dispatchEvent(type: string, state: AppState) {
  setTimeout(() => {
    for (let handler1 of listenersToAllAction) {
      handler1(state);
    }
    const listeners = listenersToActions[type];
    if (listeners) {
      for (let handler2 of listeners) {
        handler2(state);
      }
    }
  });
}

const reducer = (state = appState, action: ReduxAction) => {
  if (action.reducer) {
    const newState = action.reducer(state);
    dispatchEvent(action.type, newState);
    return newState;
  }

  dispatchEvent(action.type, state);
  return state;
};

function initActions(store: any) {
  const dispatch = store.dispatch;
  for (let [key, value] of Object.entries(Actions)) {
    Object.defineProperty(Actions, key, {
      // value: bindActionCreators(value, dispatch),
      value: function() {
        const action = value as Function;
        dispatch(action.apply(this, arguments));
      },
      writable: false
    });
  }
}

function initialize() {
  const store = createReduxStore(reducer);
  initActions(store);
  return store;
}

export default initialize();
