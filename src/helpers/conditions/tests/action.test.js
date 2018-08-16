import { isError, isFormIncluded, isType, isTypeLike } from '../action';

describe('Redux Action Conditions', () => {
  describe('isError', () => {
    const subject = isError('Error');

    it('returns true for action with an error', () => {
      const action = { payload: { error: new Error('Oh snap!') }};
      expect(subject(action)).toEqual(true);
    });

    it('returns false for action without an error', () => {
      const action = { payload: {}};
      expect(subject(action)).toEqual(false);
    });
  });

  describe('isFormIncluded', () => {
    const subject = isFormIncluded([ 'testForm' ]);

    it('returns true for action with expected form', () => {
      const action = { meta: { form: 'testForm' }};
      expect(subject(action)).toEqual(true);
    });

    it('returns false for action with no form', () => {
      const action = {};
      expect(subject(action)).toEqual(false);
    });
  });

  describe('isType', () => {
    const subject = isType('TEST_ACTION');

    it('returns true for action with expected type', () => {
      const action = { type: 'TEST_ACTION' };
      expect(subject(action)).toEqual(true);
    });

    it('returns false for action with unknown type', () => {
      const action = { type: 'UNKNOWN_ACTION' };
      expect(subject(action)).toEqual(false);
    });
  });

  describe('isTypeLike', () => {
    const subject = isTypeLike(/^TEST/);

    it('returns true for action that matches', () => {
      const action = { type: 'TEST_ACTION' };
      expect(subject(action)).toEqual(true);
    });

    it('returns false for action that does not match', () => {
      const action = { type: 'UNKNOWN_ACTION' };
      expect(subject(action)).toEqual(false);
    });
  });
});
