import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import { Provider } from 'mobx-react';
import { stores } from './stores';
import reduxStore from './redux/Store';
import { Actions } from './redux/Actions';
import { appState } from './redux/AppState';
import produce from 'immer';
// import * as serviceWorker from './serviceWorker';
const storeFGM = stores.storeFGM;

console.log('Redux store: ', appState);
for (let [key, value] of Object.entries(appState)) {
  console.log('Actions key: ', key, ', value: ', value);
}

const a = appState;
const b = produce(appState, draft => {
  draft.listAppToMonitor = [{ name: 'kim' }, { name: 'romi' }];
});

if (a === b) {
  console.log('a === b');
}

console.log('a: ', a);
console.log('b: ', b);

ReactDOM.render(
  <Provider {...stores}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
