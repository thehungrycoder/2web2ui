import { getNonDefaultIpPools } from '../ipPools';

describe('.getNonDefaultIpPools', () => {
  test('returns list of non default IP pools', () => {
    const state = {
      ipPools: {
        list: [{ id: 'default' }, { id: 'deep' }]
      }
    };

    expect(getNonDefaultIpPools(state)).toEqual([{ id: 'deep' }]);
  });
});
