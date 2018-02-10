import { fetchDeliverability, fetchDeliveriesByAttempt } from 'src/actions/metrics';
import { refreshReportRange } from 'src/actions/reportFilters';
import { getQueryFromOptions, buildCommonOptions } from 'src/helpers/metrics';
import { ACCEPTED_METRICS } from 'src/constants';

// Load new metrics for the accepted chart
// Dispatches refreshAcceptedChart() on completion.
export function refreshAcceptedMetrics(updates = {}) {
  return (dispatch, getState) => {
    updates.metrics = ACCEPTED_METRICS;
    const state = getState();
    const options = buildCommonOptions(state.reportFilters, updates);
    const query = getQueryFromOptions(options);

    dispatch(refreshReportRange(options));

    // get new data
    return Promise.all([
      dispatch(fetchDeliverability(query)),
      dispatch(fetchDeliveriesByAttempt(query))
    ])
      .then(([[aggregates], attempts]) => dispatch({
        type: 'REFRESH_ACCEPTED_CHART',
        payload: {
          aggregates,
          attempts
        }
      }));
  };
}
