import { getNonDefaultIpPools, getDefaultPool, getOrderedIpPools } from '../ipPools';

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
        ]
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

});

