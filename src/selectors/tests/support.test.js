import * as selectors from '../support';

jest.mock('src/config/supportIssues', () => [
  { id: 'without_condition' },
  { id: 'when_satisfied', condition: jest.fn(() => true) },
  { id: 'when_not_satisfied', condition: jest.fn(() => false) }
]);

jest.mock('src/selectors/accessConditionState', () => jest.fn((s) => s));

describe('Selectors: support', () => {
  describe('entitled to support', () => {
    it('when account is not loaded', () => {
      const state = {
        account: {}
      };
      expect(selectors.entitledToPhoneSupport(state)).toBeFalsy();
    });

    it('when account is not entitled to phone support', () => {
      const state = {
        account: {
          support: {
            phone: true
          }
        }
      };

      expect(selectors.entitledToPhoneSupport(state)).toBeTruthy();
    });

    it('when account entitled to phone support', () => {
      const state = {
        account: {
          support: {
            phone: false
          }
        }
      };

      expect(selectors.entitledToPhoneSupport(state)).toBeFalsy();
    });
  });

  describe('currentLimitSelector', () => {
    let account;
    let state;

    beforeEach(() => {
      account = {
        usage: {
          day: {
            limit: 1000
          }
        }
      };

      state = {
        account
      };

    });

    it('returns correct limit', () => {
      expect(selectors.currentLimitSelector(state)).toEqual(1000);
    });

    it('returns default value (0) for when limit does not exist', () => {
      delete account.usage.day.limit;
      expect(selectors.currentLimitSelector(state)).toEqual(0);
    });
  });

  describe('selectSupportIssues', () => {
    it('should return issues that satisified condition', () => {
      const state = { account: { id: 'stubbed_for_snapshot' }};
      expect(selectors.selectSupportIssues(state)).toMatchSnapshot();
    });
  });

  describe('selectSupportIssue', () => {
    const state = {}; // conditions are stubbed

    it('should return issue ', () => {
      const id = 'without_condition';
      expect(selectors.selectSupportIssue(state, id)).toEqual({ id });
    });

    it('should return undefined for not satisified issue', () => {
      expect(selectors.selectSupportIssue(state, 'when_not_satisfied')).toBeUndefined();
    });

    it('should return undefined for unknown issue', () => {
      expect(selectors.selectSupportIssue(state, 'unknown_issue')).toBeUndefined();
    });
  });
});
