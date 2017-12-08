import { createSelector } from 'reselect';

const DEFAULT = 'default';
const getIpPools = (state) => state.ipPools.list;

export const getNonDefaultIpPools = createSelector(
  [getIpPools],
  (ipPools) => ipPools.filter(({ id }) => id !== DEFAULT)
);
