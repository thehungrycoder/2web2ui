import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';

import acceptedReport from './acceptedReport';
import accessControlReady from './accessControlReady';
import account from './account';
import accountSingleSignOn from './accountSingleSignOn';
import abTesting from './abTesting';
import alerts from './alerts';
import apiKeys from './api-keys';
import auth from './auth';
import billing from './billing';
import bounceReport from './bounceReport';
import brightback from './brightback';
import cookieConsent from './cookieConsent';
import delayReport from './delayReport';
import engagementReport from './engagementReport';
import rejectionReport from './rejectionReport';
import currentUser from './currentUser';
import globalAlert from './globalAlert';
import invoices from './invoices';
import ipPools from './ipPools';
import messageEvents from './messageEvents';
import metrics from './metrics';
import notifications from './notifications';
import passwordReset from './passwordReset';
import recipientLists from './recipientLists';
import recipientValidation from './recipientValidation';
import reportOptions from './reportOptions';
import sendingDomains from './sendingDomains';
import sendingIps from './sendingIps';
import signalOptions from './signalOptions';
import signals from './signals';
import snippets from './snippets';
import subaccounts from './subaccounts';
import summaryChart from './summaryChart';
import summaryTables from './summaryTables';
import support from './support';
import suppressions from './suppressions';
import templates from './templates';
import users from './users';
import tfa from './tfa';
import tfaBackupCodes from './tfaBackupCodes';
import trackingDomains from './trackingDomains';
import typeahead from './typeahead';
import webhooks from './webhooks';
import websiteAuth from './websiteAuth';

const appReducer = combineReducers({
  acceptedReport,
  accessControlReady,
  account,
  accountSingleSignOn,
  alerts,
  auth,
  billing,
  bounceReport,
  brightback,
  cookieConsent,
  delayReport,
  engagementReport,
  rejectionReport,
  abTesting,
  apiKeys,
  currentUser,
  form,
  invoices,
  ipPools,
  globalAlert,
  metrics,
  messageEvents,
  notifications,
  passwordReset,
  reportOptions,
  recipientLists,
  recipientValidation,
  sendingDomains,
  sendingIps,
  signalOptions,
  signals,
  snippets,
  subaccounts,
  support,
  summaryChart,
  summaryTables,
  suppressions,
  templates,
  tfa,
  tfaBackupCodes,
  trackingDomains,
  typeahead,
  users,
  webhooks,
  websiteAuth
});

/**
 * Resets state to initial values on log out
 */
export default (state, action) => {
  if (action.type === 'LOGOUT') {
    state = undefined;
  }

  return appReducer(state, action);
};
