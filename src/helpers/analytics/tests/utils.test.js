import cases from 'jest-in-case';
import * as utils from '../utils';

describe('Analytics Utils', () => {
  const isWhitelistedFormTestCases = {
    'true when form name is in whitelist': {
      formName: 'loginForm',
      expectation: true
    },
    'false when form name is not in whitelist': {
      formName: 'fooForm',
      expectation: false
    }
  };

  cases('isWhitelistedForm', ({ name, formName, expectation }) => {
    expect(utils.isWhitelistedForm(formName)).toBe(expectation);
  }, isWhitelistedFormTestCases);

  const isValidEventTestCases = {
    'true when event is not empty': {
      event: { event: 'Interactions', category: 'Form', action: 'Initialize', label: 'someForm' },
      expectation: true
    },
    'false when event is falsey': {
      event: null,
      expectation: false
    }
  };

  cases('isValidEvent', ({ name, event, expectation }) => {
    expect(utils.isValidEvent(event)).toBe(expectation);
  }, isValidEventTestCases);

  const determineFormValidationStateTestCases = {
    'validation success with no syncErrors': { action: { payload: { syncErrors: {}}, meta: { form: 'fooForm' }}},
    'validation error with fields errors': {
      action: {
        payload: { syncErrors: { name: 'Required' }},
        meta: { form: 'fooForm' }
      }
    },
    'validation error with generic error': {
      action: {
        payload: { syncErrors: { _error: 'Some form level error' }},
        meta: { form: 'fooForm' }
      }
    },
    'validation error with generic error with equal sign': {
      action: {
        payload: { syncErrors: { _error: 'must be value=2' }},
        meta: { form: 'fooForm' }
      }
    }
  };

  cases('determineFormValidationState', ({ name, action }) => {
    expect(utils.determineFormValidationState(action)).toMatchSnapshot();
  }, determineFormValidationStateTestCases);


});
