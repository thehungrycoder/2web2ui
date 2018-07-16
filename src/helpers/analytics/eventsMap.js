import _ from 'lodash';
import ensure from '@redux-beacon/ensure';

import { getFormDefinition } from './eventsDefinitions';
import * as utils from './utils';

const eventsMap = {
  '@@redux-form/INITIALIZE': getFormDefinition('Initialize'),
  '@@redux-form/START_SUBMIT': getFormDefinition('Submit'),
  '@@redux-form/SET_SUBMIT_SUCCEEDED': getFormDefinition('Submit Success'),
  '@@redux-form/SET_SUBMIT_FAILED': getFormDefinition('Submit Failure'),
  '@@redux-form/UPDATE_SYNC_ERRORS': getFormDefinition(utils.determineFormValidationState)
};

export default _.mapValues(eventsMap, (val) => ensure(utils.isWhitelistedForm, val));
