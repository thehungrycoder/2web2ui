import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import spApiMiddleware from './middleware/sparkpostApiMiddleware';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import rootReducer from './reducers';

import './index.scss';

const debug = (store) => (next) => (action) => {
  if (action && action.type) {
    console.log('==================\n', JSON.stringify(action, null, 2), '\n==================');
  }
  next(action);
};

// necessary for redux devtools in development mode only
// const composeEnhancers = process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // eslint-disable-line no-mixed-operators
const store = createStore(
  rootReducer,
  applyMiddleware(debug, thunk, spApiMiddleware)
);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
