import assignedTo from '../assignedTo';

describe('assignedTo', () => {
  it('returns subaccount', () => {
    expect(assignedTo({ subaccount_id: 1 })).toEqual('subaccount');
  });

  it('returns shared', () => {
    expect(assignedTo({ shared_with_subaccounts: true })).toEqual('shared');
  });

  it('returns master', () => {
    expect(assignedTo({ shared_with_subaccounts: false })).toEqual('master');
  });
});
