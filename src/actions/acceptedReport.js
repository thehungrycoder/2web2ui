import { fetchDeliverability, fetchDeliveriesByAttempt } from 'src/actions/metrics';
import { refreshReportRange } from 'src/actions/reportFilters';
import { getQueryFromOptions, buildCommonOptions } from 'src/helpers/metrics';
import { ACCEPTED_METRICS } from 'src/constants';

// Load new metrics for the accepted chart
export function refreshAcceptedReport(updates = {}) {
  return (dispatch, getState) => {
    // TODO: consider having action creators that already pre-load their hard-coded metrics or as a selector
    updates.metrics = ACCEPTED_METRICS;

    // TODO: Remove this and watch for changes in Filters component
    const state = getState();
    const options = buildCommonOptions(state.reportFilters, updates);
    dispatch(refreshReportRange(options));

    // TODO: This can probably become a selector for each query
    const params = getQueryFromOptions(options);

    return Promise.all([
      // TODO: Should this just be an action like getAcceptedAggregates with hard-coded metrics and type?
      dispatch(fetchDeliverability({ type: 'GET_ACCEPTED_AGGREGATES', params })),
      dispatch(fetchDeliveriesByAttempt(params))
    ]);
  };
}
