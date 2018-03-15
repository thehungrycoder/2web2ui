import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import config from './config';
import { unregister } from './helpers/registerServiceWorker';
import ErrorTracker from './helpers/errorTracker';
import rootReducer from './reducers';

import './critical.scss';
import './index.scss';
import App from './App';

// necessary for redux devtools in development mode only
const composeEnhancers = process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // eslint-disable-line no-mixed-operators
const store = createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(thunk),
    applyMiddleware(ErrorTracker.middleware)
  )
);

ErrorTracker.install(config, store);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
unregister(); // our bundle is currently too big to be added to SW cache, causing problems on every deploy

// Kill loading screen
document.getElementById('critical').className += ' ready';
