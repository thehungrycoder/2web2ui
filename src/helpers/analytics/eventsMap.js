import _ from 'lodash';
import ensure from '@redux-beacon/ensure';

import { getFormDefinition } from './eventsDefinitions';


const whiteListedForms = ['loginForm', 'registerAccountForm'];
const categoryName = 'Form';

function isWhitelistedForm(event) {
  const formName = _.first(event.label.split(':'));
  return event.category === categoryName && _.includes(whiteListedForms, formName);
}

function determineFormValidationState(action) {
  const fieldErrors = _.map(action.payload.syncErrors, (val, key) => `${key}=${val}`);

  return {
    action: `Validation ${fieldErrors.length ? 'Error' : 'Success'}`,
    label: `${action.meta.form}: ${fieldErrors.join(',')}`
  };
}

const eventsMap = {
  '@@redux-form/INITIALIZE': getFormDefinition('Initialize'),
  '@@redux-form/START_SUBMIT': getFormDefinition('Submit'),
  '@@redux-form/SET_SUBMIT_SUCCEEDED': getFormDefinition('Submit Success'),
  '@@redux-form/SET_SUBMIT_FAILED': getFormDefinition('Submit Failure'),
  '@@redux-form/UPDATE_SYNC_ERRORS': getFormDefinition(determineFormValidationState)
};

export default _.mapValues(eventsMap, (val) => ensure(isWhitelistedForm, val));
