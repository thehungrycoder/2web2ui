import * as billingInfo from '../accountBillingInfo';

describe('Selector: public plans', () => {
  const state = {
    billing: {
      plans: [
        { status: 'public', volume: 1 },
        { status: 'public', volume: 3 },
        { status: 'private', volume: 4 },
        { status: 'public', volume: 2 }
      ]
    }
  };

  it('should get public plans and sort by volume', () => {
    expect(billingInfo.publicPlansSelector(state)).toMatchSnapshot();
  });
});

describe('Selector: current plan', () => {
  const state = {
    account: { subscription: { code: 'qwe' }},
    billing: {
      plans: [
        { status: 'public', code: '123' },
        { status: 'private', code: 'qwe' }
      ]
    }
  };

  it('should get current plan from billing', () => {
    expect(billingInfo.currentPlanSelector(state)).toMatchSnapshot();
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
