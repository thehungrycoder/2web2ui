import { fetchRejectionReasonsByDomain, fetchDeliverability } from 'src/actions/metrics';
import { refreshReportRange } from 'src/actions/reportFilters';
import { getQueryFromOptions, buildCommonOptions, getMetricsFromKeys } from 'src/helpers/metrics';

const rejectionMetrics = getMetricsFromKeys([
  'count_rejected',
  'count_targeted'
]);

export function refreshRejections(updates = {}) {
  return (dispatch, getState) => {
    const { reportFilters } = getState();

    updates.metrics = rejectionMetrics;
    const options = buildCommonOptions(reportFilters, updates);
    const query = getQueryFromOptions(options);

    dispatch(refreshReportRange(options));

    return Promise.all([
      dispatch(fetchRejectionReasonsByDomain(query)),
      dispatch(fetchDeliverability(query))
    ])
      .then(([reasons, [aggregates]]) => {
        dispatch({
          type: 'REFRESH_REJECTION_BY_DOMAIN_TABLE',
          payload: { reasons }
        });
        dispatch({
          type: 'REFRESH_REJECTION_AGGREGATES',
          payload: { aggregates }
        });
      });
  };
}
