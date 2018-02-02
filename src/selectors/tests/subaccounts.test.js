import * as selector from '../subaccounts';

describe('Subaccount selectors', () => {

  describe('getSubaccountIdFromParams', () => {
    it('should return subaccount router params', () => {
      const props = { match: { params: { id: 101 }}};
      expect(selector.getSubaccountIdFromParams({}, props)).toEqual(101);
    });
  });

  describe('selectSubaccountIdFromQuery', () => {
    it('should return subaccount id from query params', () => {
      const props = { location: { search: '?subaccount=101' }};
      expect(selector.selectSubaccountIdFromQuery({}, props)).toEqual('101');
    });
  });

  describe('getSubaccounts', () => {
    it('should return subaccount list', () => {
      const state = { subaccounts: { list: ['sub', 'list']}};
      expect(selector.getSubaccounts(state, {})).toEqual(['sub', 'list']);
    });
  });

  describe('selectSubaccountFromQuery', () => {
    it('should return subaccount object', () => {
      const state = { subaccounts: { list: [
        { name: 'sub 1', id: 101 },
        { name: 'sub 2', id: 501 }
      ]}};
      const props = { location: { search: '?subaccount=501' }};
      expect(selector.selectSubaccountFromQuery(state, props)).toEqual({ name: 'sub 2', id: 501 });
    });
  });

});
