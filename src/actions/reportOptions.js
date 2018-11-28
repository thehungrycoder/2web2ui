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
import _ from 'lodash';

// array of all lists that need to be re-filtered when time changes
const metricLists = [
  fetchMetricsDomains,
  fetchMetricsCampaigns,
  fetchMetricsSendingIps,
  fetchMetricsIpPools
];

/**
 * Returns a thunk that initializes the non-metric lists used
 * for populating the typeahead cache.
 *
 * The thunk skips calling any of the lists that already have values
 * in the redux store
 */
export function initTypeaheadCache() {
  return (dispatch, getState) => {
    const { templates, subaccounts, sendingDomains } = getState();
    const requests = [];

    if (templates.list.length === 0) {
      requests.push(dispatch(listTemplates()));
    }

    if (subaccounts.list.length === 0) {
      requests.push(dispatch(listSubaccounts()));
    }

    if (sendingDomains.list.length === 0) {
      requests.push(dispatch(listSendingDomains()));
    }
    return Promise.all(requests);
  };
}

/**
 * Refreshes the typeahead cache with the metrics lists. This occurs dynamically
 * whenever the user types in the search field but with a debounce.
 *
 * It will first try to pull the data from cache, if it exists and the time range is the same.
 * If there is no cache entry, it will make the api calls and add the results to the cache.
 */
export function refreshTypeaheadCache(options) {
  const params = getQueryFromOptions(options);
  return (dispatch, getState) => {
    const { typeahead } = getState();
    const { to: cachedTo, from: cachedFrom, cache } = typeahead;
    const { match, to: currentTo, from: currentFrom } = options;

    if (cachedFrom === currentFrom && cachedTo === currentTo && cache[match]) {
      dispatch({
        type: 'UPDATE_METRICS_FROM_CACHE',
        payload: cache[match]
      });
      return Promise.resolve();
    }

    const requests = metricLists.map((list) => dispatch(list(params)));
    return Promise.all(requests).then((arrayOfMetrics) => {
      // Flattens the array from array of metrics objects to an object with each metric as a key
      const metricsList = _.reduce(arrayOfMetrics, (accumulator, metric) => _.assign(accumulator, metric), {});
      const payload = {
        from: currentFrom,
        to: currentTo,
        itemToCache: { [match]: metricsList }
      };

      dispatch({
        type: 'UPDATE_TYPEAHEAD_METRICS_CACHE',
        payload
      });
    });

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
 * @param {Object} update
 * @param {Date} update.from
 * @param {Date} update.to
 * @param {String} update.relativeRange
 */
export function refreshReportOptions(update) {
  return (dispatch, getState) => {
    const { reportOptions } = getState();
    update = { ...reportOptions, ...update };

    // calculate relative dates if range is not "custom"
    if (update.relativeRange && update.relativeRange !== 'custom') {
      update = { ...update, ...getRelativeDates(update.relativeRange) };
    }

    return dispatch({
      type: 'REFRESH_REPORT_OPTIONS',
      payload: update
    });
  };
}
