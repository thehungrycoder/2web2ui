import {
  getNonDefaultIpPools,
  getDefaultPool,
  getOrderedIpPools,
  selectIpsForCurrentPool,
  selectCurrentPoolInitialValues
} from '../ipPools';

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

  it('should return the default pool', () => {
    expect(getDefaultPool(state)).toEqual({ id: 'default', ips: [1, 2, 3]});
  });

  it('should return a list of non default IP pools', () => {
    expect(getNonDefaultIpPools(state)).toEqual([
      { id: 'big', ips: [1, 2, 3, 4, 5, 6]},
      { id: 'none', ips: []},
      { id: 'small', ips: [1, 2]}
    ]);
  });

  it('should return a list pools (default first, then ordered by id ascending)', () => {
    expect(getOrderedIpPools(state).map((pool) => pool.id)).toEqual([
      'default', 'big', 'none', 'small'
    ]);
  });

  it('should select IPs for the current pool', () => {
    expect(selectIpsForCurrentPool(state)).toEqual([
      { external_ip: '1.1.1.1', id: '1_1_1_1' },
      { external_ip: '2.2.2.2', id: '2_2_2_2' },
      { external_ip: '3.3.3.3', id: '3_3_3_3' }
    ]);
  });

  it('should return an object of ips assigned to their current pool, for initial values', () => {
    expect(selectCurrentPoolInitialValues(state)).toEqual({
      name: 'MY CURRENT POOL',
      '1_1_1_1': 'my_current_pool',
      '2_2_2_2': 'my_current_pool',
      '3_3_3_3': 'my_current_pool'
    });
  });

});

