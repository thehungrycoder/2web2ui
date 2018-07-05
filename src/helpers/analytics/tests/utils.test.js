import cases from 'jest-in-case';
import * as utils from '../utils';

describe('Analytics Utils', () => {
  const isWhitelistedFormTestCases = {
    'true when category is Form, form name is whitelisted one': {
      event: { category: 'Form', label: 'loginForm' },
      expectation: true
    },
    'true when category is Form, form name is whitelisted one with validation errors': {
      event: {
        category: 'Form',
        label: 'loginForm: name=Required,email=Required'
      }, expectation: true
    },
    'false when category is Form, form name is not whitelisted one': {
      event: { category: 'Form', label: 'apiKeyForm' },
      expectation: false
    },
    'false when category is not Form, form name is whitelisted one': {
      event: { category: 'Foo', label: 'loginForm' },
      expectation: false
    }
  };

  cases('isWhitelistedForm', ({ name, event, expectation }) => {
    expect(utils.isWhitelistedForm(event)).toBe(expectation);
  }, isWhitelistedFormTestCases);

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
