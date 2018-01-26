import * as selector from '../subaccounts';

describe('Subaccount selectors', () => {
  describe('getSubaccountIdFromQuery', () => {
    it('should return subaccount id from query params', () => {
      const props = { location: { search: '?subaccount=101' }};
      expect(selector.getSubaccountIdFromQuery(props)).toEqual('101');
    });
  });
});
