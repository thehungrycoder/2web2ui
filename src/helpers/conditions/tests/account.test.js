import {
  onPlan,
  onPlanWithStatus,
  onServiceLevel,
  isEnterprise,
  isSuspendedForBilling,
  hasStatus,
  hasStatusReasonCategory,
  isCustomBilling,
  isSelfServeBilling,
  hasOnlineSupport,
  hasUiOption
} from '../account';

test('Condition: onPlan', () => {
  const condition = onPlan('p1');
  expect(condition({ accountPlan: { code: 'p1' }})).toEqual(true);
  expect(condition({ accountPlan: { code: 'p2' }})).toEqual(false);
});

test('Condition: onPlanWithStatus', () => {
  const condition = onPlanWithStatus('deprecated');
  expect(condition({ accountPlan: { status: 'deprecated' }})).toEqual(true);
  expect(condition({ accountPlan: { status: 'bananas' }})).toEqual(false);
});

test('Condition: onServiceLevel', () => {
  const condition = onServiceLevel('other');
  expect(condition({ account: { service_level: 'other' }})).toEqual(true);
  expect(condition({ account: { service_level: 'standard' }})).toEqual(false);
});

describe('Condition: isEnterprise', () => {

  let condition;
  let state;
  beforeEach(() => {
    state = {
      accountPlan: {},
      plans: [],
      account: {
        subscription: {
          code: 'abc1'
        },
        service_level: 'whatev'
      }
    };
    condition = isEnterprise;
  });

  it('should return a function that returns true if on ent1 plan', () => {
    state.accountPlan.code = 'ent1';
    expect(condition(state)).toEqual(true);
  });

  it('should return a function that returns true if on enterprise service level', () => {
    state.account.service_level = 'enterprise';
    expect(condition(state)).toEqual(true);
  });

  it('should return a function that returns false if not on ent1 plan OR enterprise service level', () => {
    expect(condition(state)).toEqual(false);
  });

});

describe('Condition: isSuspendedForBilling', () => {

  it('should return true if account is suspended and category is 100.01', () => {
    const account = { status: 'suspended', status_reason_category: '100.01' };
    expect(isSuspendedForBilling({ account })).toEqual(true);
  });

  it('should return false if account is NOT suspended', () => {
    const account = { status: 'active', status_reason_category: '100.01' };
    expect(isSuspendedForBilling({ account })).toEqual(false);
  });

  it('should return false if account does NOT have the right status reason category', () => {
    const account = { status: 'suspended', status_reason_category: '200.01' };
    expect(isSuspendedForBilling({ account })).toEqual(false);
  });

});

describe('Condition: hasStatus', () => {

  it('should return a function that returns whether the account has the given status', () => {
    const account = { status: 'active' };
    expect(hasStatus('active')({ account })).toEqual(true);
    expect(hasStatus('suspended')({ account })).toEqual(false);
  });

});

describe('Conditon: hasStatusReasonCategory', () => {

  it('should return a function that returns whether the account has the given status reason category', () => {
    const account = { status_reason_category: '100.01' };
    expect(hasStatusReasonCategory('100.01')({ account })).toEqual(true);
    expect(hasStatusReasonCategory('200.01')({ account })).toEqual(false);
  });

  it('should return false if status reason category is undefined or empty', () => {
    const account = {};
    expect(hasStatusReasonCategory('100.01')({ account })).toEqual(false);
    account.status_reason_category = null;
    expect(hasStatusReasonCategory('100.01')({ account })).toEqual(false);
  });

});

describe('Condition: isSelfServeBilling', () => {

  it('should return whether the account is self serve billing', () => {
    const account = {};
    expect(isSelfServeBilling({ account })).toEqual(false);
    account.subscription = {};
    expect(isSelfServeBilling({ account })).toEqual(false);
    account.subscription.self_serve = false;
    expect(isSelfServeBilling({ account })).toEqual(false);
    account.subscription.self_serve = true;
    expect(isSelfServeBilling({ account })).toEqual(true);
  });

});

describe('Condition: hasOnlineSupport', () => {
  it('should return true for accounts with online support', () => {
    const state = {
      account: {
        support: {
          online: true
        }
      }
    };

    expect(hasOnlineSupport(state)).toEqual(true);
  });

  it('should return false for accounts without online support', () => {
    const state = {};
    expect(hasOnlineSupport(state)).toEqual(false);
  });
});

describe('Condition: hasUiOption', () => {
  it('should return true when option is set', () => {
    const state = {
      account: {
        options: {
          ui: { iceCream: 'vanilla' }
        }
      }
    };
    expect(hasUiOption('iceCream')(state)).toEqual(true);
  });

  it('should return false when option is missing', () => {
    const state = {
      account: {
        options: {
          ui: {}
        }
      }
    };
    expect(hasUiOption('iceCream')(state)).toEqual(false);
  });
});


describe('Condition: isCustomBilling', () => {
  it('should return false', () => {
    const state = {
      account: {
        subscription: {
          custom: false
        }
      }
    };

    expect(isCustomBilling(state)).toEqual(false);
  });

  it('should return true', () => {
    const state = {
      account: {
        subscription: {
          custom: true
        }
      }
    };

    expect(isCustomBilling(state)).toEqual(true);
  });
});
