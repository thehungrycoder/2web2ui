import entitledToSupport, { currentLimitSelector, allowSendingLimitRequestSelector } from '../support';
import * as billingInfo from '../accountBillingInfo';

jest.mock('../accountBillingInfo', () => ({
  currentPlanSelector: jest.fn()
}));


describe('Selectors: support', () => {
  it('when account is not loaded', () => {
    const state = {
      account: {}
    };
    expect(entitledToSupport(state)).toBeFalsy();
  });

  it('when account is not entitled to online support', () => {
    const state = {
      account: {
        support: {
          online: false,
          phone: true
        }
      }
    };
    expect(entitledToSupport(state)).toBeFalsy();
  });

  it('when account entitled to online support', () => {
    const state = {
      account: {
        support: {
          online: true,
          phone: false
        }
      }
    };
    expect(entitledToSupport(state)).toBeTruthy();
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
      expect(currentLimitSelector(state)).toEqual(1000);
    });

    it('returns null for when limit does not exist', () => {
      delete account.usage.day.limit;
      expect(currentLimitSelector(state)).toEqual(null);
    });
  });

  describe('allowSendingLimitRequestSelector', () => {
    let plan;
    let state;

    beforeEach(() => {
      plan = {};
      state = {};
      billingInfo.currentPlanSelector.mockReturnValue(plan);
    });

    it('returns false for deprecated plans', () => {
      plan.status = 'deprecated';
      expect(allowSendingLimitRequestSelector(state)).toEqual(false);
    });

    it('returns false for free plans', () => {
      plan.isFree = true;
      expect(allowSendingLimitRequestSelector(state)).toEqual(false);
    });

    it('returns true for other (paid) plans', () => {
      expect(allowSendingLimitRequestSelector(state)).toEqual(true);
    });

  });
});
