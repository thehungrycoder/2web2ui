import { combineReducers } from 'redux';
import { reducer as reduxFormReducer } from 'redux-form';
import auth from './auth';
import account from './account';
import apiFailure from './apiFailure';
import billing from './billing';
import currentUser from './currentUser';
import metrics from './metrics';
import reportFilters from './reportFilters';
import sendingDomains from './sendingDomains';
import subaccounts from './subaccounts';
import summaryChart from './summaryChart';
import templates from './templates';
import webhooks from './webhooks';

export default combineReducers({
  auth,
  account,
  apiFailure,
  billing,
  currentUser,
  form: reduxFormReducer,
  metrics,
  reportFilters,
  sendingDomains,
  subaccounts,
  summaryChart,
  templates,
  webhooks
});
