import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// ?? step 2 :redux
import { Provider } from 'react-redux';
import store from 'store';

// ! error alert ----
import { ToastContainer } from 'react-toastify';
import '../node_modules/react-toastify/dist/ReactToastify.css';
ReactDOM.render(
  <Provider store={store}>
    <App />
    <ToastContainer />
  </Provider>,

  document.getElementById('root')
);
