import _ from 'lodash';
import { getFormDefinition } from './eventsDefinitions';

function determineFormValidationState(action) {
  return {
    action: `Validation ${_.isEmpty(action.payload.syncErrors) ? 'Success' : 'Error'}`,
    label: action.meta.form
  };
}
const eventsMap = {
  '@@redux-form/INITIALIZE': getFormDefinition('Initialize'),
  '@@redux-form/START_SUBMIT': getFormDefinition('Submit', null, 1),
  '@@redux-form/SET_SUBMIT_SUCCEEDED': getFormDefinition('Submit Success', null, 1),
  '@@redux-form/SET_SUBMIT_FAILED': getFormDefinition('Submit Failure', null, 0),
  '@@redux-form/UPDATE_SYNC_ERRORS': getFormDefinition(determineFormValidationState)
};

export default eventsMap;
