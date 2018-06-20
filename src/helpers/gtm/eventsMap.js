import { getFormDefinition } from './eventsDefinitions';

const eventsMap = {
  '@@redux-form/FOCUS': getFormDefinition('Focus'), //can also be like  (action) => { "do whatever and return" }
  // '@@redux-form/CHANGE': getFormDefinition('Change'),
  '@@redux-form/SET_SUBMIT_SUCCEEDED': getFormDefinition('Submit Success', 1),
  '@@redux-form/SET_SUBMIT_FAILED': getFormDefinition('Submit Failure', 0)
};

export default eventsMap;
