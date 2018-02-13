import { fetchDeliverability, fetchDeliveriesByAttempt } from 'src/actions/metrics';
import { getQueryFromOptions } from 'src/helpers/metrics';
import { ACCEPTED_METRICS } from 'src/constants';

// Load new metrics for the accepted chart
export function refreshAcceptedReport(updates = {}) {
  return (dispatch) => {
    // TODO: consider having action creators that already pre-load their hard-coded metrics or as a selector
    // TODO: This can probably become a selector for each query
    const params = getQueryFromOptions({ ...updates, metrics: ACCEPTED_METRICS });

    return Promise.all([
      // TODO: Should this just be an action like getAcceptedAggregates with hard-coded metrics and type?
      dispatch(fetchDeliverability({ type: 'GET_ACCEPTED_AGGREGATES', params })),
      dispatch(fetchDeliveriesByAttempt(params))
    ]);
  };
}
