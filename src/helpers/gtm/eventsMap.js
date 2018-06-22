import _ from 'lodash';
import { getFormDefinition } from './eventsDefinitions';

function determineFormValidationState(action) {
  return {
    action: `Validation ${_.isEmpty(action.payload.syncErrors) ? 'Success' : 'Error'}`,
    label: `${action.meta.form}: ${JSON.stringify(action.payload.syncErrors)}`
  };
}
const eventsMap = {
  '@@redux-form/INITIALIZE': getFormDefinition('Initialize'),
  '@@redux-form/START_SUBMIT': getFormDefinition('Submit'),
  '@@redux-form/SET_SUBMIT_SUCCEEDED': getFormDefinition('Submit Success'),
  '@@redux-form/SET_SUBMIT_FAILED': getFormDefinition('Submit Failure'),
  '@@redux-form/UPDATE_SYNC_ERRORS': getFormDefinition(determineFormValidationState)
};

export default eventsMap;
