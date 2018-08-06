import _ from 'lodash';
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
