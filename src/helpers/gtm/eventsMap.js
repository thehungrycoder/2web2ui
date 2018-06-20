import * as events from './eventsDefinitions';

const eventsMap = {
  '@@redux-form/FOCUS': events.formFocus,
  '@@redux-form/CHANGE': events.formChange,
  '@@redux-form/SET_SUBMIT_SUCCEEDED': events.formSubmitSuccess,
  '@@redux-form/SET_SUBMIT_FAILED': events.formSubmitFailed
};

export default eventsMap;
