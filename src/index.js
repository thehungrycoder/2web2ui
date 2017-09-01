import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import spApiMiddleware from './middleware/sparkpostApiMiddleware';
import generalRequest from './middleware/generalRequestMiddleware';
import registerServiceWorker from './helpers/registerServiceWorker';
import rootReducer from './reducers';

import './critical.scss';
import './index.scss';
import App from './App';

// necessary for redux devtools in development mode only
const composeEnhancers = process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // eslint-disable-line no-mixed-operators
const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk, spApiMiddleware, generalRequest))
);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();

// Kill loading screen
document.getElementById('critical').className += ' ready';
