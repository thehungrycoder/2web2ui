import { createSelector } from 'reselect';
import { encodeIp } from 'src/helpers/ipNames';

const DEFAULT = 'default';
const getIpPools = (state) => state.ipPools.list;
const selectCurrentPool = ({ ipPools = {}}) => ipPools.pool || {};

export const selectIpsForCurrentPool = createSelector(
  [selectCurrentPool],
  ({ ips = []}) => ips.map((ip) => ({
    ...ip,
    id: encodeIp(ip.external_ip)
  }))
);

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
    return [ defaultPool, ...others ];
  }
);

/**
 * Grab all IPs for the current pool and return
 * an object where each key is one converted IP
 * whose value is the id of the current Pool
 *
 * This is used to set initial values on a form where the
 * converted IPs are the name of each field and the initial
 * value is the pool that IP is currently assigned to.
 *
 * Note: IPs are converted to make them safe to use as
 * React props, with _ instead of .
 */
export const selectCurrentPoolInitialValues = createSelector(
  [selectCurrentPool, selectIpsForCurrentPool],
  (currentPool, ips) => ({
    name: currentPool.name,
    ...ips.reduce((result, ip) => {
      result[ip.id] = currentPool.id;
      return result;
    }, {})
  })
);
