import _ from 'lodash';
import flatten from 'flat';
import { ANALYTICS_WHITELISTED_FORMS } from '../../constants';

/**
 * Checks whether the form name is whitelisted.
 * @param formName
 * @returns {boolean}
 */
export function isWhitelistedForm(formName) {
  return _.includes(ANALYTICS_WHITELISTED_FORMS, formName);
}

/**
 * Whether an event is valid and should be sent to GTM
 * @param event
 * @returns {boolean}
 */
export function isValidEvent(event) {
  return !_.isEmpty(event);
}

/**
 * Flattens a nested object and converts to key=val
 * @param action
 * @returns {*}
 */
function formatFieldErrors(action) {
  const syncErrors = _.get(action, 'payload.syncErrors', null);
  if (_.isEmpty(syncErrors)) {
    return null;
  }

  const flattenedSyncErrors = flatten(syncErrors);

  return _.map(flattenedSyncErrors, (val, key) => `${key}=${val}`).join(',');
}

/**
 * Determines the validation state.
 * If syncErrors is empty, form is valid; otherwise invalid.
 * @param action
 * @returns {{action: string, label: string}}
 */
export function determineFormValidationState(action) {
  const fieldErrors = formatFieldErrors(action);

  const actionName = `Validation ${fieldErrors ? 'Error' : 'Success'}`;
  const label = fieldErrors ? `${action.meta.form}: ${fieldErrors}` : action.meta.form;

  return {
    action: actionName,
    label
  };
}
