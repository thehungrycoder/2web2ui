import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';

import account from './account';
import apiFailure from './apiFailure';
import auth from './auth';
import billing from './billing';
import credentials from './credentials';
import currentUser from './currentUser';
import metrics from './metrics';
import reportFilters from './reportFilters';
import sendingDomains from './sendingDomains';
import subaccounts from './subaccounts';
import summaryChart from './summaryChart';
import templates from './templates';
import webhooks from './webhooks';

export default combineReducers({
  account,
  apiFailure,
  auth,
  billing,
  credentials,
  currentUser,
  form,
  metrics,
  reportFilters,
  sendingDomains,
  subaccounts,
  summaryChart,
  templates,
  webhooks
});
