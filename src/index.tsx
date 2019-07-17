import './index.scss';
import App from './App';
import React from 'react';
import ReactDOM from 'react-dom';
import store from './store/Store';
import { Provider } from 'react-redux';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
