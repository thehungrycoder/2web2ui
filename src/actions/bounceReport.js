import { fetchDeliverability, fetchBounceClassifications, fetchBounceReasonsByDomain } from 'src/actions/metrics';
import { maybeRefreshTypeaheadCache, refreshReportRange } from 'src/actions/reportFilters';
import { getQueryFromOptions, buildCommonOptions, getMetricsFromKeys } from 'src/helpers/metrics';
import { getBandTypes, reshapeCategories, formatAggregates } from 'src/helpers/bounce';
import _ from 'lodash';


// Load new metrics for the bounce chart
// Dispatches refreshBounceChart() on completion.
export function refreshBounceChartMetrics(updates = {}) {
  return (dispatch, getState) => {
    const state = getState();

    const bounceMetrics = [
      'count_targeted',
      'count_bounce',
      'count_inband_bounce',
      'count_outofband_bounce'
    ];

    updates.metrics = getMetricsFromKeys(bounceMetrics);

    const options = buildCommonOptions(state.reportFilters, updates);

    maybeRefreshTypeaheadCache(dispatch, options, updates);

    dispatch(refreshReportRange(options));

    // convert new meta data into query param format
    const aggregateParams = _.omit(getQueryFromOptions(options), 'precision');
    const bounceParams = { ...aggregateParams, metrics: 'count_bounce' };

    // get new data
    return dispatch(fetchDeliverability(aggregateParams))
      .then((aggregates) => {
        if (!aggregates[0].count_bounce) {
          return;
        }

        dispatch(fetchBounceClassifications(bounceParams))
          .then((classifications) => dispatch(refreshBounceChart({ aggregates, classifications })));
      });
  };
}

// Refresh the chart with the new data
export function refreshBounceChart({ aggregates, classifications }) {
  const formattedAggregates = formatAggregates(aggregates[0]);
  return {
    type: 'REFRESH_BOUNCE_CHART',
    payload: {
      categories: reshapeCategories(classifications),
      aggregates: formattedAggregates,
      types: getBandTypes(formattedAggregates)
    }
  };
}

// Load new metrics for the bounce reasons table
// Dispatches refreshBounceTable() on completion.
export function refreshBounceTableMetrics(updates = {}) {
  return (dispatch, getState) => {
    const state = getState();
    const options = buildCommonOptions(state.reportFilters, updates);
    const query = getQueryFromOptions(options);
    const baseParams = _.omit(query, 'precision');
    const params = { ...baseParams, metrics: 'count_bounce' };

    return dispatch(fetchBounceReasonsByDomain(params))
      .then((reasons) => {
        dispatch(refreshBounceTable({ reasons }));
      });
  };
}

// Refhres the table with the new data
export function refreshBounceTable({ reasons }) {
  return {
    type: 'REFRESH_BOUNCE_TABLE',
    payload: { reasons }
  };
}
