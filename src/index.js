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

const debug = () => (next) => (action) => {
  console.log(`=== ACTION: ${action.type} ===`); // eslint-disable-line no-console
  console.log(action); // eslint-disable-line no-console
  next(action);
};

// necessary for redux devtools in development mode only
const composeEnhancers = process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // eslint-disable-line no-mixed-operators
const store = createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(thunk),
    applyMiddleware(debug),
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

/*  Google Analytics */
window.gtag('config', config.gaTag);

// appends tag manager script src to head
const gaScript = document.createElement('script');
gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${config.gaTag}`;
gaScript.async = true;
document.head.appendChild(gaScript);
/*  Google Analytics End */

/**
 * Track unhandled promise rejects
 *
 * @param {PromiseRejectionEvent} event
 * @param {Error} event.reason
 */
window.onunhandledrejection = ({ reason }) => {
  ErrorTracker.report('onunhandledrejection', reason);
};
