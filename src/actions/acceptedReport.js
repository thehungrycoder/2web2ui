import { fetchDeliverability, fetchDeliveriesByAttempt } from 'src/actions/metrics';
import { maybeRefreshTypeaheadCache, refreshReportRange } from 'src/actions/reportFilters';
import { getQueryFromOptions, buildCommonOptions, getMetricsFromKeys, transformData } from 'src/helpers/metrics';
import { reshapeAttempts } from 'src/helpers/accepted';
import _ from 'lodash';

// Load new metrics for the accepted chart
// Dispatches refreshAcceptedChart() on completion.
export function refreshAcceptedMetrics(updates = {}) {
  return (dispatch, getState) => {
    const state = getState();

    const acceptedMetrics = [
      'count_targeted',
      'count_sent',
      'count_accepted',
      'avg_delivery_time_first',
      'avg_delivery_time_subsequent',
      'avg_msg_size'
    ];

    updates.metrics = getMetricsFromKeys(acceptedMetrics);

    const options = buildCommonOptions(state.reportFilters, updates);

    maybeRefreshTypeaheadCache(dispatch, options, updates);

    dispatch(refreshReportRange(options));

    // convert new meta data into query param format
    const aggregateParams = _.omit(getQueryFromOptions(options), 'precision');
    const deliveryParams = _.omit(aggregateParams, 'metrics');

    // get new data
    return dispatch(fetchDeliverability(aggregateParams))
      .then((aggregates) => {
        if (!aggregates[0].count_accepted) {
          return;
        }

        return dispatch(fetchDeliveriesByAttempt(deliveryParams)).then((attempts) => {
          dispatch(refreshAcceptedChart({
            metrics: updates.metrics,
            aggregates,
            attempts
          }));
        });
      });
  };
}

// Refresh the chart with the new data
export function refreshAcceptedChart({ aggregates, attempts, metrics }) {
  return {
    type: 'REFRESH_ACCEPTED_CHART',
    payload: {
      metrics,
      aggregates: transformData(aggregates, metrics)[0],
      attempts: reshapeAttempts(attempts)
    }
  };
}
