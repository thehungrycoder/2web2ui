import _ from 'lodash';
import { fetchDelayReasonsByDomain, fetchDeliverability } from 'src/actions/metrics';
import { maybeRefreshTypeaheadCache, refreshReportRange } from 'src/actions/reportFilters';

import { getQueryFromOptions, buildCommonOptions, getMetricsFromKeys } from 'src/helpers/metrics';

export function refreshDelayTable({ reasons }) {
  return {
    type: 'REFRESH_DELAY_TABLE',
    payload: { reasons }
  };
}

export function loadDelayReasonsByDomain(updates = {}) {
  return (dispatch, getState) => {
    const { reportFilters } = getState();
    const options = buildCommonOptions(reportFilters, updates);
    const query = getQueryFromOptions(options);
    const params = _.omit(query, ['precision', 'metrics']);

    maybeRefreshTypeaheadCache(dispatch, options, updates);
    dispatch(refreshReportRange(options));

    return dispatch(fetchDelayReasonsByDomain(params))
      .then((reasons) => {
        dispatch(refreshDelayTable({ reasons }));
      });
  };
}

export function loadDelayMetrics(updates = {}) {
  return (dispatch, getState) => {
    const { reportFilters } = getState();

    const delayMetrics = [
      'count_accepted',
      'count_delayed',
      'count_delayed_first'
    ];

    updates.metrics = getMetricsFromKeys(delayMetrics);
    const options = buildCommonOptions(reportFilters, updates);
    const params = _.omit(getQueryFromOptions(options), 'precision');

    maybeRefreshTypeaheadCache(dispatch, options, updates);
    dispatch(refreshReportRange(options));

    return dispatch(fetchDeliverability(params))
      .then((aggregates) => {
        dispatch(refreshDelayMetrics({ aggregates }));
      });
  };

}

export function refreshDelayMetrics({ aggregates }) {
  return {
    type: 'REFRESH_DELAY_AGGREGATES',
    payload: {
      aggregates: aggregates[0]
    }
  };
}
