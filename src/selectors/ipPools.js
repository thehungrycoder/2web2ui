import { createSelector } from 'reselect';

const DEFAULT = 'default';
const getIpPools = (state) => state.ipPools.list;

export const getDefaultPool = createSelector(
  [getIpPools],
  (ipPools) => ipPools.find(({ id }) => id === DEFAULT)
);

export const getNonDefaultIpPools = createSelector(
  [getIpPools],
  (ipPools) => ipPools.filter(({ id }) => id !== DEFAULT)
);

export const getOrderedIpPools = createSelector(
  [getIpPools, getDefaultPool, getNonDefaultIpPools],
  (initialList, defaultPool, others) => {
    if (!defaultPool) {
      return initialList;
    }
    const sorted = others.sort((a, b) => b.ips.length - a.ips.length);
    return [ defaultPool, ...sorted ];
  }
);
