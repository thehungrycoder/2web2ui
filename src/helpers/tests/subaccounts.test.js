import * as subaccounts from '../subaccounts';

describe('Subaccount Helpers', () => {
  describe('setSubaccountQuery', () => {
    it('should create a subaccount qp', () => {
      expect(subaccounts.setSubaccountQuery(101)).toEqual('?subaccount=101');
      expect(subaccounts.setSubaccountQuery('102')).toEqual('?subaccount=102');
    });

    it('should not create a subaccount qp if id is missing', () => {
      expect(subaccounts.setSubaccountQuery()).toEqual('');
    });
  });
});
