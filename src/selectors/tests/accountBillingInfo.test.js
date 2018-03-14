/* eslint max-lines: ["error", 205] */

import * as billingInfo from '../accountBillingInfo';

describe('Selector: public plans', () => {
  let store;
  beforeEach(() => {
    store = {
      billing: {
        plans: [
          { status: 'public', volume: 1 },
          { status: 'public', volume: 3 },
          { status: 'private', volume: 4 },
          { status: 'public', volume: 2 }
        ]
      }
    };
  });

  it('should get public plans and sort by volume', () => {
    expect(billingInfo.publicPlansSelector(store)).toMatchSnapshot();
  });

  it('returns empty list on no plans (billing.plans)', () => {
    delete store.billing.plans;
    expect(billingInfo.publicPlansSelector(store)).toEqual([]);
  });
});

describe('Selector: current plan', () => {
  let store;

  beforeEach(() => {
    store = {
      account: { subscription: { code: 'qwe' }},
      billing: {
        plans: [
          { status: 'public', code: '123' },
          { status: 'private', code: 'qwe' }
        ]
      }
    };
  });

  it('should get current plan from billing', () => {
    expect(billingInfo.currentPlanSelector(store)).toMatchSnapshot();
  });

  it('returns empty object when matching plan found', () => {
    store.account.subscription.code = 'no-match';
    expect(billingInfo.currentPlanSelector(store)).toEqual({});
  });
});

describe('Selector: should expose card', () => {
  const store = {
    account: { subscription: { code: 'qwe' }, billing: {}},
    billing: {
      plans: [
        { status: 'public', code: '123' },
        { status: 'public', code: 'qwe', isFree: false }
      ]
    }
  };

  it('should return true if on paid plan', () => {
    expect(billingInfo.shouldExposeCardSelector(store)).toEqual(true);
  });
});

describe('Selector: can change plan', () => {
  it('should return false with a suspension', () => {
    const store = {
      account: { isSuspendedForBilling: true }
    };

    expect(billingInfo.canChangePlanSelector(store)).toEqual(false);
  });

  it('should return false with a pending plan change', () => {
    const store = {
      account: { pending_subscription: {}}
    };

    expect(billingInfo.canChangePlanSelector(store)).toEqual(false);
  });
});

describe('currentPlanCodeSelector: can select plan code', () => {
  let store;
  beforeEach(() => {
    store = {
      account: { subscription: { code: 'qwe' }}
    };
  });

  it('returns correct plan code', () => {
    expect(billingInfo.currentPlanCodeSelector(store)).toEqual('qwe');
  });
});

describe('isAWSAccountSelector', () => {
  let store;
  beforeEach(() => {
    store = {
      account: { subscription: { code: 'free', type: 'aws' }}
    };
  });

  it('returns true when subscription type is aws', () => {
    expect(billingInfo.isAWSAccountSelector(store)).toBe(true);
  });
});

describe('getPlansSelector', () => {
  let store;
  beforeEach(() => {
    store = {
      account: { subscription: { code: 'free', type: 'aws' }},
      billing: {
        plans: [
          { status: 'private', code: '123', awsMarketplace: true },
          { status: 'public', code: 'qwe', isFree: false },
          { status: 'public', code: 'qwe2', isFree: true }
        ]
      }
    };
  });

  it('returns aws plans when subscription type is aws', () => {
    expect(billingInfo.getPlansSelector(store)).toEqual([{ status: 'private', code: '123', awsMarketplace: true }]);
  });

  it('does not return free for manually billed accounts', () => {
    store.account.subscription = { code: 'ent1', type: 'Default' };
    expect(billingInfo.getPlansSelector(store)).toEqual([{ status: 'public', code: 'qwe', isFree: false }]);
  });

  it('returns public plans for self serve customers', () => {
    store.account.subscription = { code: 'free', type: 'Default', self_serve: true };
    expect(billingInfo.getPlansSelector(store)).toEqual([
      { status: 'public', code: 'qwe', isFree: false },
      { status: 'public', code: 'qwe2', isFree: true }
    ]);
  });
});

describe('isSelfServeOrAWSSelector', () => {
  let store;
  beforeEach(() => {
    store = {
      account: { subscription: { type: 'aws' }}
    };
  });

  it('returns true when subscription type is aws', () => {
    expect(billingInfo.isSelfServeOrAWSSelector(store)).toBe(true);
  });

  it('returns true when it is self serve', () => {
    store.account.subscription = { type: 'default', self_serve: true };
    expect(billingInfo.isSelfServeOrAWSSelector(store)).toBe(true);
  });

  it('returns false for non-self-serve and non aws', () => {
    store.account.subscription = { type: 'default', self_serve: false };
    expect(billingInfo.isSelfServeOrAWSSelector(store)).toBe(false);
  });
});

describe('canPurchaseIps', () => {
  let store;
  beforeEach(() => {
    store = {
      account: {
        subscription: { code: 'paid1' },
        billing: {}
      },
      billing: {
        plans: [
          { status: 'public', code: '123', isFree: true },
          { status: 'public', code: 'paid1', isFree: false, canPurchaseIps: true }
        ]
      }
    };
  });

  it('returns true when plan can buy ip and has billing setup', () => {
    expect(billingInfo.canPurchaseIps(store)).toBe(true);
  });

  it('returns false when plan can buy ip but billing is not setup', () => {
    delete store.account.billing;
    expect(billingInfo.canPurchaseIps(store)).toBe(false);
  });

  it('returns true when aws plan can buy ip but billing not setup', () => {
    delete store.account.billing;
    store.account.subscription.type = 'aws';
    expect(billingInfo.canPurchaseIps(store)).toBe(true);
  });

});
