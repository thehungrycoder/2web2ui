import { notOnPlan, notOnServiceLevel, notEnterprise } from '../account';

describe('Condition: notOnPlan', () => {

  it('should return a function that returns true if not on given plan', () => {
    const condition = notOnPlan('p1');
    expect(condition({ account: { subscription: { code: 'p2' }}})).toEqual(true);
  });

  it('should return a function that returns false if on the given plan', () => {
    const condition = notOnPlan('p1');
    expect(condition({ account: { subscription: { code: 'p1' }}})).toEqual(false);
  });

});

describe('Condition: notOnServiceLevel', () => {

  it('should return a function that returns true if not on given level', () => {
    const condition = notOnServiceLevel('other');
    expect(condition({ account: { service_level: 'standard' }})).toEqual(true);
  });

  it('should return a function that returns false if on the given level', () => {
    const condition = notOnServiceLevel('other');
    expect(condition({ account: { service_level: 'other' }})).toEqual(false);
  });

});

describe('Condition: notEnterprise', () => {

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
    condition = notEnterprise();
  });

  it('should return a function that returns false if on ent1 plan', () => {
    state.account.subscription.code = 'ent1';
    expect(condition(state)).toEqual(false);
  });

  it('should return a function that returns false if on enterprise service level', () => {
    state.account.service_level = 'enterprise';
    expect(condition(state)).toEqual(false);
  });

  it('should return a function that returns true if not on ent1 plan or enterprise service level', () => {
    expect(condition(state)).toEqual(true);
  });

});
