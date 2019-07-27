import './index.scss';
import App from './components/App/App';
import React from 'react';
import ReactDOM from 'react-dom';
import store from './store/Store';
import { Provider } from 'react-redux';
import { FocusStyleManager } from '@blueprintjs/core';

FocusStyleManager.onlyShowFocusOnTabs();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
