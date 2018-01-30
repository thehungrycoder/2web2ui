import * as selector from '../subaccounts';

describe('Subaccount selectors', () => {
  describe('selectSubaccountIdFromQuery', () => {
    it('should return subaccount id from query params', () => {
      const props = { location: { search: '?subaccount=101' }};
      expect(selector.selectSubaccountIdFromQuery({}, props)).toEqual('101');
    });
  });
});
