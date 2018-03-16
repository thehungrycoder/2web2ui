import {
  getNonDefaultIpPools,
  getDefaultPool,
  getOrderedIpPools,
  selectIpsForCurrentPool,
  selectIpPoolFormInitialValues,
  shouldShowIpPurchaseCTA
} from '../ipPools';

import * as accountBillingInfoSelectors from 'src/selectors/accountBillingInfo';

jest.mock('src/selectors/accountBillingInfo', () => ({
  currentPlanCodeSelector: jest.fn(() => 'ent1')
}));

jest.mock('src/constants', () => ({
  ENTERPRISE_PLAN_CODES: ['ent1']
}));

describe('Selector: ipPools', () => {

  let state;

  beforeEach(() => {
    state = {
      ipPools: {
        list: [
          { id: 'big', ips: [1, 2, 3, 4, 5, 6]},
          { id: 'none', ips: []},
          { id: 'default', ips: [1, 2, 3]},
          { id: 'small', ips: [1, 2]}
        ],
        pool: {
          name: 'MY CURRENT POOL',
          id: 'my_current_pool',
          ips: [
            { external_ip: '1.1.1.1' },
            { external_ip: '2.2.2.2' },
            { external_ip: '3.3.3.3' }
          ]
        }
      }
    };
  });

  describe('getDefaultPool', () => {
    it('should return the default pool', () => {
      expect(getDefaultPool(state)).toEqual({ id: 'default', ips: [1, 2, 3]});
    });
  });

  describe('getNonDefaultIpPools', () => {
    it('should return a list of non default IP pools', () => {
      expect(getNonDefaultIpPools(state)).toEqual([
        { id: 'big', ips: [1, 2, 3, 4, 5, 6]},
        { id: 'none', ips: []},
        { id: 'small', ips: [1, 2]}
      ]);
    });
  });

  describe('getOrderedIpPools', () => {
    it('should return a list pools (default first, then ordered by id ascending)', () => {
      expect(getOrderedIpPools(state).map((pool) => pool.id)).toEqual([
        'default', 'big', 'none', 'small'
      ]);
    });
  });


  describe('selectIpsForCurrentPool', () => {
    it('should select IPs for the current pool', () => {
      expect(selectIpsForCurrentPool(state)).toEqual([
        { external_ip: '1.1.1.1', id: '1_1_1_1' },
        { external_ip: '2.2.2.2', id: '2_2_2_2' },
        { external_ip: '3.3.3.3', id: '3_3_3_3' }
      ]);
    });
  });


  describe('selectIpPoolFormInitialValues', () => {
    it('should return an object of ips assigned to their current pool, for initial values', () => {
      expect(selectIpPoolFormInitialValues(state, { isNew: false })).toEqual({
        name: 'MY CURRENT POOL',
        '1_1_1_1': 'my_current_pool',
        '2_2_2_2': 'my_current_pool',
        '3_3_3_3': 'my_current_pool'
      });
    });

    it('should return empty init values in new mode', () => {
      expect(selectIpPoolFormInitialValues(state, { isNew: true })).toEqual({});
    });
  });

  describe('shouldShowIpPurchaseCTA', () => {
    it('returns false for enterprise plans', () => {
      expect(shouldShowIpPurchaseCTA(state)).toBe(false);
    });

    it('returns true for non-enterprise plans', () => {
      accountBillingInfoSelectors.currentPlanCodeSelector.mockReturnValue('ccfree1');
      expect(shouldShowIpPurchaseCTA(state)).toBe(true);
    });
  });

});

