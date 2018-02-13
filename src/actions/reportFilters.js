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
    const requests = []; //metricLists.map((list) => dispatch(list(params)));
    requests.push(dispatch(listTemplates()), dispatch(listSubaccounts()), dispatch(listSendingDomains()));
    return Promise.all(requests);
  };
}

export function refreshTypeaheadCache(options) {
  const params = getQueryFromOptions(options);
  return (dispatch) => {
    const requests = metricLists.map((list) => dispatch(list(params)));
    return Promise.all(requests);
  };
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

/**
 * Refreshes the date range for all reports
 *
 * Calculates relative ranges if a non-custom relativeRange value is present,
 * which will override passed in from/to dates
 *
 * Will also conditionally refresh the typeahead cache if the
 * from and to values changed
 *
 * @param {Object} update
 * @param {Date} update.from
 * @param {Date} update.to
 * @param {String} update.relativeRange
 */
export function refreshReportOptions(update) {
  return (dispatch, getState) => {
    const { reportFilters } = getState();
    update = { ...reportFilters, ...update };

    if (update.relativeRange && update.relativeRange !== 'custom') {
      update = { ...update, ...getRelativeDates(update.relativeRange) };
    }

    // do nothing if there is no change (this may be unnecessary later)
    if (reportFilters.from === update.from && reportFilters.to === update.to) {
      return;
    }

    dispatch(refreshTypeaheadCache(update));

    return dispatch({
      type: 'REFRESH_REPORT_OPTIONS',
      payload: update
    });
  };
}
