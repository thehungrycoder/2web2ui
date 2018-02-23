import {
  fetchMetricsDomains,
  fetchMetricsCampaigns,
  fetchMetricsSendingIps,
  fetchMetricsIpPools
} from './metrics';

import { listTemplates } from './templates';
import { list as listSubaccounts } from './subaccounts';
import { list as listSendingDomains } from './sendingDomains';
import { getRelativeDates, isSameDate } from 'src/helpers/date';
import { getQueryFromOptions } from 'src/helpers/metrics';

// array of all lists that need to be re-filtered when time changes
const metricLists = [
  fetchMetricsDomains,
  fetchMetricsCampaigns,
  fetchMetricsSendingIps,
  fetchMetricsIpPools
];

/**
 * Returns a thunk that initializes the non-metric lists used
 * for populating the typeahead cache (metrics lists are populated
 * during date range refreshes)
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

export function refreshTypeaheadCache(options) {
  const params = getQueryFromOptions(options);
  return (dispatch) => {
    const requests = metricLists.map((list) => dispatch(list(params)));
    return Promise.all(requests);
  };
}

export function maybeRefreshTypeaheadCache(update) {
  return (dispatch, getState) => {
    const { reportOptions, metrics } = getState();
    const allCachesEmpty = ['domains', 'campaigns', 'sendingIps', 'ipPools'].every((cache) => (
      metrics[cache].length === 0
    ));

    if (allCachesEmpty) {
      dispatch(refreshTypeaheadCache(update));
      return;
    }

    // do nothing if there is no change in from or to
    if (
      isSameDate(reportOptions.from, update.from) &&
      isSameDate(reportOptions.to, update.to)
    ) {
      return;
    }

    // refresh if range is changing or if the range is staying the same but is "custom"
    if (update.relativeRange !== reportOptions.relativeRange || update.relativeRange === 'custom') {
      dispatch(refreshTypeaheadCache(update));
    }
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
    const { reportOptions } = getState();
    update = { ...reportOptions, ...update };

    // calculate relative dates if range is not "custom"
    if (update.relativeRange && update.relativeRange !== 'custom') {
      update = { ...update, ...getRelativeDates(update.relativeRange) };
    }

    // do nothing if there is no change in from or to
    if (
      !update.force &&
      isSameDate(reportOptions.from, update.from) &&
      isSameDate(reportOptions.to, update.to)
    ) {
      return;
    }

    dispatch(maybeRefreshTypeaheadCache(update));

    return dispatch({
      type: 'REFRESH_REPORT_OPTIONS',
      payload: update
    });
  };
}
