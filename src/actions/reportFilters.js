import {
  fetchMetricsDomains,
  fetchMetricsCampaigns,
  fetchMetricsSendingIps,
  fetchMetricsIpPools
} from './metrics';

import { listTemplates } from './templates';
import { list as listSubaccounts } from './subaccounts';
import { list as listSendingDomains } from './sendingDomains';

// TODO: make this smarter to not always refresh templates, subaccounts, and
// sending domains, since they aren't dependent on the params...
// maybe load (all) vs refresh (4 metrics calls)
export function refreshTypeaheadCache(params) {
  return (dispatch) => Promise.all([
    dispatch(fetchMetricsDomains(params)),
    dispatch(fetchMetricsCampaigns(params)),
    dispatch(fetchMetricsSendingIps(params)),
    dispatch(fetchMetricsIpPools(params)),
    dispatch(listTemplates()),
    dispatch(listSubaccounts()),
    dispatch(listSendingDomains())
  ]);
}

export function addFilter(payload) {
  return {
    type: 'ADD_FILTER',
    payload
  };
}

export function removeFilter(payload) {
  return {
    type: 'REMOVE_FILTER',
    payload
  };
}
