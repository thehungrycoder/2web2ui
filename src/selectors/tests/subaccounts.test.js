import * as selector from '../subaccounts';

describe('Subaccount selectors', () => {

  describe('selectSubaccount', () => {
    it('should return subaccount unformatted', () => {
      const state = { subaccounts: { subaccount: { status: 'foo', key: 'value' }}};
      expect(selector.selectSubaccount(state)).toEqual({ compliance: false, status: 'foo', key: 'value' });
    });

    it('should return compliance_status as status when it is not active', () => {
      const state = { subaccounts: { subaccount: { compliance_status: 'terminated', key: 'value' }}};
      expect(selector.selectSubaccount(state)).toEqual({ compliance: true, status: 'terminated', key: 'value' });

    });
  });

  describe('selectSubaccounts', () => {
    it('should return a list of formatted subaccounts', () => {
      const state = {
        subaccounts: {
          list: [
            {
              compliance_status: 'active',
              status: 'valid',
              name: 'Subby 1'
            },
            {
              compliance_status: 'not-active',
              status: 'status',
              name: 'Subby 2'
            }
          ]
        }
      };

      expect(selector.selectSubaccounts(state)).toEqual([
        {
          compliance: false,
          status: 'valid',
          name: 'Subby 1'
        },
        {
          compliance: true,
          status: 'not-active',
          name: 'Subby 2'
        }
      ]);
    });

    it('should return if user has subaccounts', () => {
      const state = { currentUser: { has_subaccounts: false }};
      expect(selector.hasSubaccounts(state)).toEqual(false);
    });
  });

  describe('getSubaccountIdFromProps', () => {
    it('should return subaccount id from id field in props', () => {
      const props = { id: 101 };
      expect(selector.getSubaccountIdFromProps({}, props)).toEqual(101);
    });
  });

  describe('selectSubaccountIdFromProps', () => {
    it('should return subaccount id from subaccountId field in props', () => {
      const props = { subaccountId: 101 };
      expect(selector.selectSubaccountIdFromProps({}, props)).toEqual(101);
    });
  });

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

  describe('selectSubaccountsById', () => {
    it('should return an empty object', () => {
      const state = {
        subaccounts: {
          list: []
        }
      };

      expect(selector.selectSubaccountsById(state)).toEqual({});
    });

    it('should return a map of subaccounts', () => {
      const state = {
        subaccounts: {
          list: [
            { id: 123, name: 'First Example' },
            { id: 456, name: 'Second Example' }
          ]
        }
      };

      expect(selector.selectSubaccountsById(state)).toEqual({
        123: {
          id: 123,
          name: 'First Example',
          compliance: false,
          status: 'active'
        },
        456: {
          id: 456,
          name: 'Second Example',
          compliance: false,
          status: 'active'
        }
      });
    });
  });
});
