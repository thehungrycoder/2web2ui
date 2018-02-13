import { fetchDeliverability, fetchDeliveriesByAttempt } from 'src/actions/metrics';
import { getQueryFromOptions } from 'src/helpers/metrics';
import { ACCEPTED_METRICS } from 'src/constants';

// Load new metrics for the accepted chart
export function refreshAcceptedReport(updates = {}) {
  return (dispatch) => {
    const params = getQueryFromOptions({ ...updates, metrics: ACCEPTED_METRICS });

    return Promise.all([
      dispatch(fetchDeliverability({ type: 'GET_ACCEPTED_AGGREGATES', params })),
      dispatch(fetchDeliveriesByAttempt(params))
    ]);
  };
}
