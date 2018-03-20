import { entitledToSupport, currentLimitSelector, allowSendingLimitRequestSelector } from '../support';
import * as billingInfo from '../accountBillingInfo';
import cases from 'jest-in-case';

jest.mock('../accountBillingInfo', () => ({
  currentPlanSelector: jest.fn()
}));

describe('Selectors: support', () => {
  describe('entitledToSupport', () => {
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

    it('returns default value (0) for when limit does not exist', () => {
      delete account.usage.day.limit;
      expect(currentLimitSelector(state)).toEqual(0);
    });
  });

  const testCases = {
    'return false for deprecated plans': { plan: { status: 'deprecated' }, expected: false },
    'return false for free plans': { plan: { isFree: true }, expected: false },
    'return true for paid public plans': { plan: { status: 'public', code: '2.5m-0817' }, expected: true },
    'return true for paid private': { plan: { status: 'public', code: '2.5m-0817' }, expected: true },
    'return true for aws plans': { plan: { status: 'public', code: 'aws_basic', type: 'aws' }, expected: true }
  };

  cases('allowSendingLimitRequestSelector', ({ plan, expected }) => {
    billingInfo.currentPlanSelector.mockReturnValue(plan);
    expect(allowSendingLimitRequestSelector({ plan })).toBe(expected);
  }, testCases);

});
