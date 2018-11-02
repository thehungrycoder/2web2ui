import * as billingInfo from '../accountBillingInfo';

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
  let state;

  beforeEach(() => {
    state = {
      account: { subscription: { code: 'paid' }, billing: {}},
      billing: {
        plans: [
          { status: 'public', code: '123' },
          { status: 'public', code: 'paid', isFree: false },
          { status: 'public', code: 'free', isFree: true },
          { status: 'public', code: 'ccfree1', isFree: true }
        ]
      }
    };
  });

  it('should return true if on paid plan', () => {
    expect(billingInfo.canUpdateBillingInfoSelector(state)).toEqual(true);
  });

  it('should return true if on free legacy plan', () => {
    state.account.subscription.code = 'ccfree1';
    expect(billingInfo.canUpdateBillingInfoSelector(state)).toEqual(true);
  });

  it('should return false if on free plan', () => {
    state.account.subscription.code = 'free';
    expect(billingInfo.canUpdateBillingInfoSelector(state)).toEqual(false);
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

  it('should return false with a custom plan', () => {
    const state = {
      account: {
        subscription: {
          custom: true
        }
      }
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
      'canPurchaseIps',
      'currentPlan',
      'onZuoraPlan',
      'plans',
      'isAWSAccount'
    ]);
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

describe('plan selector', () => {
  let state;

  beforeEach(() => {
    state = {
      account: {
        subscription: { self_serve: true },
        billing: {}
      },
      billing: {
        plans: [
          { code: 'dep', status: 'deprecated' },
          { code: 'dep-aws', status: 'deprecated', awsMarketplace: true },
          { code: 'pub', status: 'public' },
          { code: 'pub-free', status: 'public', isFree: true },
          { code: 'pub-aws', status: 'public', awsMarketplace: true },
          { code: 'pub-aws-free', status: 'public', awsMarketplace: true, isFree: true },
          { code: 'sec', status: 'secret' },
          { code: 'sec-aws', status: 'secret', awsMarketplace: true }
        ]
      }
    };
  });

  describe('selectAvailablePlans', () => {
    it('should return active plans', () => {
      expect(billingInfo.selectAvailablePlans(state)).toMatchSnapshot();
    });

    it('should return active paid plans', () => {
      state.account.subscription.self_serve = false;
      expect(billingInfo.selectAvailablePlans(state)).toMatchSnapshot();
    });

    it('should return active AWS plans', () => {
      state.account.subscription.type = 'aws';
      expect(billingInfo.selectAvailablePlans(state)).toMatchSnapshot();
    });
  });

  describe('selectVisiblePlans', () => {
    it('should return public plans', () => {
      expect(billingInfo.selectVisiblePlans(state)).toMatchSnapshot();
    });

    it('should return public paid plans', () => {
      state.account.subscription.self_serve = false;
      expect(billingInfo.selectVisiblePlans(state)).toMatchSnapshot();
    });

    it('should return public AWS plans', () => {
      state.account.subscription.type = 'aws';
      expect(billingInfo.selectVisiblePlans(state)).toMatchSnapshot();
    });

    it('should not return new free plans if customer on free1 plan', () => {
      state.account.subscription.code = 'free1';
      state.billing.plans.push({ code: 'free1' });
      expect(billingInfo.selectVisiblePlans(state)).toMatchSnapshot();
    });
  });
});
