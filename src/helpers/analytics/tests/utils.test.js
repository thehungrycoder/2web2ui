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
});
