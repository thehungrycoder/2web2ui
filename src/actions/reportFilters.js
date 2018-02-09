import {
  fetchMetricsDomains,
  fetchMetricsCampaigns,
  fetchMetricsSendingIps,
  fetchMetricsIpPools
} from './metrics';

import { listTemplates } from './templates';
import { list as listSubaccounts } from './subaccounts';
import { list as listSendingDomains } from './sendingDomains';
import { getRelativeDates } from 'src/helpers/date';
import { getQueryFromOptions } from 'src/helpers/metrics';

// array of all lists that need to be re-filtered when time changes
const metricLists = [
  fetchMetricsDomains,
  fetchMetricsCampaigns,
  fetchMetricsSendingIps,
  fetchMetricsIpPools
];

/**
 * Returns a thunk that gets the metrics filter lists to populate cache,
 * plus templates, subaccounts, and sending domains
 *
 * The thunk is a no-op if the cache has already been initialized, i.e.
 * metrics.domains is an array and not undefined
 */
export function initTypeaheadCache(params) {
  return (dispatch, getState) => {
    const { metrics } = getState();
    if (Array.isArray(metrics.domains)) {
      return;
    }
    const requests = metricLists.map((list) => dispatch(list(params)));
    requests.push(dispatch(listTemplates()), dispatch(listSubaccounts()), dispatch(listSendingDomains()));
    return Promise.all(requests);
  };
}

// TODO: rename refreshTypeaheadCache
export function refreshTypeaheadCache(params) {
  return (dispatch) => {
    const requests = metricLists.map((list) => dispatch(list(params)));
    return Promise.all(requests);
  };
}

export function maybeRefreshTypeaheadCache(dispatch, options, updates = {}) {
  // refresh the typeahead cache if the date range has been updated
  const { relativeRange, from, to } = updates;

  if (relativeRange || from || to) {
    const params = getQueryFromOptions({ from: options.from, to: options.to });
    dispatch(refreshTypeaheadCache(params));
  }
}

export function addFilters(payload) {
  return {
    type: 'ADD_FILTERS',
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

export function refreshRelativeRange(options = {}) {
  const range = { ...options, ...getRelativeDates(options.relativeRange) };

  return {
    type: 'REFRESH_REPORT_RANGE',
    payload: range
  };
}
