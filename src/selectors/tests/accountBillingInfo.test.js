/* eslint max-lines: ["error", 300] */

import * as billingInfo from '../accountBillingInfo';

describe('Selector: public plans', () => {
  let state;
  beforeEach(() => {
    state = {
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
    expect(billingInfo.publicPlansSelector(state)).toMatchSnapshot();
  });

  it('returns empty list on no plans (billing.plans)', () => {
    delete state.billing.plans;
    expect(billingInfo.publicPlansSelector(state)).toEqual([]);
  });
});

describe('Selector: current plan', () => {
  let state;

  beforeEach(() => {
    state = {
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
    expect(billingInfo.currentPlanSelector(state)).toMatchSnapshot();
  });

  it('returns empty object when matching plan found', () => {
    state.account.subscription.code = 'no-match';
    expect(billingInfo.currentPlanSelector(state)).toEqual({});
  });
});

describe('Selector: can update billing info', () => {
  const state = {
    account: { subscription: { code: 'qwe' }, billing: {}},
    billing: {
      plans: [
        { status: 'public', code: '123' },
        { status: 'public', code: 'qwe', isFree: false }
      ]
    }
  };

  it('should return true if on paid plan', () => {
    expect(billingInfo.canUpdateBillingInfoSelector(state)).toEqual(true);
  });
});

describe('Selector: can change plan', () => {
  it('should return false with a suspension', () => {
    const state = {
      account: { isSuspendedForBilling: true }
    };

    expect(billingInfo.canChangePlanSelector(state)).toEqual(false);
  });

  it('should return false with a pending plan change', () => {
    const state = {
      account: { pending_subscription: {}}
    };

    expect(billingInfo.canChangePlanSelector(state)).toEqual(false);
  });
});

describe('currentPlanCodeSelector: can select plan code', () => {
  let state;
  beforeEach(() => {
    state = {
      account: { subscription: { code: 'qwe' }}
    };
  });

  it('returns correct plan code', () => {
    expect(billingInfo.currentPlanCodeSelector(state)).toEqual('qwe');
  });
});

describe('selectBillingInfo', () => {

  it('returns the combined billing info state', () => {
    const state = {
      account: { subscription: { code: 'qwe' }, billing: {}},
      billing: {
        plans: [
          { status: 'public', code: '123' },
          { status: 'public', code: 'qwe', isFree: false }
        ]
      }
    };

    expect(Object.keys(billingInfo.selectBillingInfo(state))).toEqual([
      'canUpdateBillingInfo',
      'canChangePlan',
      'currentPlan',
      'plans'
    ]);
  });

});

describe('isAWSAccountSelector', () => {
  let state;
  beforeEach(() => {
    state = {
      account: { subscription: { code: 'free', type: 'aws' }}
    };
  });

  it('returns true when subscription type is aws', () => {
    expect(billingInfo.isAWSAccountSelector(state)).toBe(true);
  });
});

describe('getPlansSelector', () => {
  let state;
  beforeEach(() => {
    state = {
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
    expect(billingInfo.getPlansSelector(state)).toEqual([{ status: 'private', code: '123', awsMarketplace: true }]);
  });

  it('does not return free for manually billed accounts', () => {
    state.account.subscription = { code: 'ent1', type: 'Default' };
    expect(billingInfo.getPlansSelector(state)).toEqual([{ status: 'public', code: 'qwe', isFree: false }]);
  });

  it('returns public plans for self serve customers', () => {
    state.account.subscription = { code: 'free', type: 'Default', self_serve: true };
    expect(billingInfo.getPlansSelector(state)).toEqual([
      { status: 'public', code: 'qwe', isFree: false },
      { status: 'public', code: 'qwe2', isFree: true }
    ]);
  });
});

describe('isSelfServeOrAWSSelector', () => {
  let state;
  beforeEach(() => {
    state = {
      account: { subscription: { type: 'aws' }}
    };
  });

  it('returns true when subscription type is aws', () => {
    expect(billingInfo.isSelfServeOrAWSSelector(state)).toBe(true);
  });

  it('returns true when it is self serve', () => {
    state.account.subscription = { type: 'default', self_serve: true };
    expect(billingInfo.isSelfServeOrAWSSelector(state)).toBe(true);
  });

  it('returns false for non-self-serve and non aws', () => {
    state.account.subscription = { type: 'default', self_serve: false };
    expect(billingInfo.isSelfServeOrAWSSelector(state)).toBe(false);
  });
});

describe('canPurchaseIps', () => {
  let state;
  beforeEach(() => {
    state = {
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
    expect(billingInfo.canPurchaseIps(state)).toBe(true);
  });

  it('returns false when plan can buy ip but billing is not setup', () => {
    delete state.account.billing;
    expect(billingInfo.canPurchaseIps(state)).toBe(false);
  });

  it('returns true when aws plan can buy ip but billing not setup', () => {
    delete state.account.billing;
    state.account.subscription.type = 'aws';
    expect(billingInfo.canPurchaseIps(state)).toBe(true);
  });

});
