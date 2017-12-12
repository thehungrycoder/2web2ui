import {
  fetchMetricsDomains,
  fetchMetricsCampaigns,
  fetchMetricsSendingIps,
  fetchMetricsIpPools
} from './metrics';

import { listTemplates } from './templates';
import { list as listSubaccounts } from './subaccounts';
import { list as listSendingDomains } from './sendingDomains';
import { getQueryFromOptions } from 'src/helpers/metrics';

export function refreshTypeaheadCache(params, timeFiltered = false) {
  return (dispatch) => {
    dispatch({ type: 'REFRESH_TYPEAHEAD_CACHE' });
    const requests = [
      dispatch(fetchMetricsDomains(params)),
      dispatch(fetchMetricsCampaigns(params)),
      dispatch(fetchMetricsSendingIps(params)),
      dispatch(fetchMetricsIpPools(params))
    ];

    // only need to refresh these lists on initial load, not when date ranges change
    if (!timeFiltered) {
      requests.push(dispatch(listTemplates()), dispatch(listSubaccounts()), dispatch(listSendingDomains()));
    }

    return Promise.all(requests);
  };
}

export function maybeRefreshTypeaheadCache(dispatch, options, updates = {}) {
  // refresh the typeahead cache if the date range has been updated
  const { relativeRange, from, to } = updates;

  if (relativeRange || from || to) {
    const params = getQueryFromOptions({ from: options.from, to: options.to });
    dispatch(refreshTypeaheadCache(params, true));
  }
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

// refresh the date range
export function refreshReportRange(options) {
  return {
    type: 'REFRESH_REPORT_RANGE',
    payload: options
  };
}
