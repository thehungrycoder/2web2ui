import * as subaccounts from '../subaccounts';

describe('setSubaccountQuery', () => {
  it('should return an empty string for undefined', () => {
    expect(subaccounts.setSubaccountQuery()).toEqual('');
  });

  it('should return an empty string for null', () => {
    expect(subaccounts.setSubaccountQuery()).toEqual('');
  });

  it('should return a query string for an integer', () => {
    expect(subaccounts.setSubaccountQuery(101)).toEqual('?subaccount=101');
  });

  it('should return a query string for an string', () => {
    expect(subaccounts.setSubaccountQuery('101')).toEqual('?subaccount=101');
  });
});
