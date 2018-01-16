import _ from 'lodash';

import { fetchRejectionReasonsByDomain, fetchDeliverability } from 'src/actions/metrics';
import { refreshReportRange, maybeRefreshTypeaheadCache } from 'src/actions/reportFilters';
import { getQueryFromOptions, buildCommonOptions, getMetricsFromKeys } from 'src/helpers/metrics';

function refreshRejectionsTable(reasons) {
  return {
    type: 'REFRESH_REJECTION_BY_DOMAIN_TABLE',
    payload: { reasons }
  };
}

export function refreshRejectionTableMetrics(updates = {}) {
  return (dispatch, getState) => {
    const { reportFilters } = getState();
    const unsupportedParams = ['precision', 'metrics'];

    const options = buildCommonOptions(reportFilters, updates);
    const query = getQueryFromOptions(options);
    const params = _.omit(query, unsupportedParams);

    maybeRefreshTypeaheadCache(dispatch, options, updates);
    dispatch(refreshReportRange(options));

    return dispatch(fetchRejectionReasonsByDomain(params))
      .then((reasons) => {
        dispatch(refreshRejectionsTable(reasons));
      });

  };
}

function refreshRejectionMetrics(aggregates) {
  return {
    type: 'REFRESH_REJECTION_AGGREGATES',
    payload: {
      aggregates: aggregates[0]
    }
  };
}

export function loadRejectionMetrics(updates = {}) {
  return (dispatch, getState) => {
    const { reportFilters } = getState();

    const rejectionMetrics = [
      'count_rejected',
      'count_targeted'
    ];

    updates.metrics = getMetricsFromKeys(rejectionMetrics);
    const options = buildCommonOptions(reportFilters, updates);
    const params = _.omit(getQueryFromOptions(options), 'precision');

    maybeRefreshTypeaheadCache(dispatch, options, updates);
    dispatch(refreshReportRange(options));

    return dispatch(fetchDeliverability(params))
      .then((aggregates) => {
        dispatch(refreshRejectionMetrics(aggregates));
      });
  };
}
