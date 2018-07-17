import _ from 'lodash';
import { ANALYTICS_WHITELISTED_FORMS } from '../../constants';

export function isWhitelistedForm(formName) {
  return _.includes(ANALYTICS_WHITELISTED_FORMS, formName);
}

export function isValidEvent(event) {
  return !_.isEmpty(event);
}

export function determineFormValidationState(action) {
  const fieldErrors = _.map(action.payload.syncErrors, (val, key) => `${key}=${val.replace('=','%3D')}`); //in case any error message contains equal sign (=)

  return {
    action: `Validation ${fieldErrors.length ? 'Error' : 'Success'}`,
    label: `${action.meta.form}: ${fieldErrors.join(',')}`
  };
}
