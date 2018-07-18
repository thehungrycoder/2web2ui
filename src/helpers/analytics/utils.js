import _ from 'lodash';
import flatten from 'flat';
import { ANALYTICS_WHITELISTED_FORMS } from '../../constants';

export function isWhitelistedForm(formName) {
  return _.includes(ANALYTICS_WHITELISTED_FORMS, formName);
}

export function isValidEvent(event) {
  return !_.isEmpty(event);
}

function formatFieldErrors(action) {
  const syncErrors = _.get(action, 'payload.syncErrors', null);
  if (_.isEmpty(syncErrors)) {
    return null;
  }

  const flattendSyncErrors = flatten(syncErrors);

  return _.map(flattendSyncErrors, (val, key) => `${key}=${val}`).join(',');
}

export function determineFormValidationState(action) {
  const fieldErrors = formatFieldErrors(action);

  const actionName = `Validation ${fieldErrors ? 'Error' : 'Success'}`;
  const label = fieldErrors ? `${action.meta.form}: ${fieldErrors}` : action.meta.form;

  return {
    action: actionName,
    label
  };
}
