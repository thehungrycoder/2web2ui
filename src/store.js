import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import ErrorTracker from './helpers/errorTracker';
import analyticsMiddleware from './helpers/analytics/middleware';

const configureStore = () => {
  // necessary for redux devtools in development mode only
  const composeEnhancers = process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // eslint-disable-line no-mixed-operators

  const store = createStore(
    rootReducer,
    composeEnhancers(
      applyMiddleware(thunk),
      applyMiddleware(ErrorTracker.middleware),
      applyMiddleware(analyticsMiddleware)
    )
  );

  // Hot module replacement
  if (process.env.NODE_ENV !== 'production') {
    if (module.hot) {
      module.hot.accept('./reducers', () => {
        store.replaceReducer(rootReducer);
      });
    }
  }

  return store;
};

export default configureStore;
