import {
  onPlan,
  onServiceLevel,
  isEnterprise,
  isSuspendedForBilling,
  hasStatus,
  hasStatusReasonCategory,
  isSelfServeBilling
} from '../account';

describe('Condition: onPlan', () => {

  it('should return a function that returns true if on given plan', () => {
    const condition = onPlan('p1');
    expect(condition({ account: { subscription: { code: 'p1' }}})).toEqual(true);
  });

  it('should return a function that returns false if not on the given plan', () => {
    const condition = onPlan('p1');
    expect(condition({ account: { subscription: { code: 'p2' }}})).toEqual(false);
  });

});

describe('Condition: onServiceLevel', () => {

  it('should return a function that returns false if not on given level', () => {
    const condition = onServiceLevel('other');
    expect(condition({ account: { service_level: 'standard' }})).toEqual(false);
  });

  it('should return a function that returns true if on the given level', () => {
    const condition = onServiceLevel('other');
    expect(condition({ account: { service_level: 'other' }})).toEqual(true);
  });

});

describe('Condition: isEnterprise', () => {

  let condition;
  let state;
  beforeEach(() => {
    state = {
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
    state.account.subscription.code = 'ent1';
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

// export const hasStatus = (status) => ({ account }) => account.status === status;
// export const hasStatusReasonCategory = (category) => ({ account }) => account.status_reason_category === category;
// export const isSuspendedForBilling = all(
//   hasStatus('suspended'),
//   hasStatusReasonCategory('100.01')
// );
// export const isSelfServeBilling = ({ account }) => _.get(account, 'subscription.self_serve', false);

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
