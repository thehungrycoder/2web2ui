import cases from 'jest-in-case';
import * as utils from '../utils';

describe('Analytics Utils', () => {
  describe('isWhitelistedForm', () => {
    it('returns true if form is a whitelisted form', () => {
      expect(utils.isWhitelistedForm('loginForm')).toBe(true);
    });

    it('returns false if form is not a whitelisted form', () => {
      expect(utils.isWhitelistedForm('fooForm')).toBe(false);
    });
  });

  describe('isValidEvent', () => {
    it('returns true if event is not empty', () => {
      expect(utils.isValidEvent({ event: 'Interactions', category: 'Form', action: 'Initialize', label: 'someForm' })).toBe(true);
    });
    it('returns false if event is empty', () => {
      expect(utils.isValidEvent(null)).toBe(false);
    });
  });

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
    'validation error with nested field names are flattened': {
      action: {
        payload: { syncErrors: { card: { number: '1234', expire: '0820' }, name: 'foobar' }},
        meta: { form: 'fooForm' }
      }
    }
  };

  cases('determineFormValidationState', ({ name, action }) => {
    expect(utils.determineFormValidationState(action)).toMatchSnapshot();
  }, determineFormValidationStateTestCases);
});
