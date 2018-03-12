import { onPlan, onServiceLevel, isEnterprise, isSuspendedForBilling } from '../account';

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

  it('should return a function that returns true if account is suspended and category is 100.01', () => {
    const account = { status: 'suspended', status_reason_category: '100.01' };
    expect(isSuspendedForBilling({ account })).toEqual(true);
  });

  it('should return a function that returns false if account is NOT suspended', () => {
    const account = { status: 'active', status_reason_category: '100.01' };
    expect(isSuspendedForBilling({ account })).toEqual(false);
  });

  it('should return a function that returns false if account does NOT have the right status reason category', () => {
    const account = { status: 'suspended', status_reason_category: '200.01' };
    expect(isSuspendedForBilling({ account })).toEqual(false);
  });

});
