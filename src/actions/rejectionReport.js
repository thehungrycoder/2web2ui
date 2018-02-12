import { fetchRejectionReasonsByDomain, fetchDeliverability } from 'src/actions/metrics';
import { refreshReportRange } from 'src/actions/reportFilters';
import { getQueryFromOptions, buildCommonOptions, getMetricsFromKeys } from 'src/helpers/metrics';

const REJECTION_METRICS = getMetricsFromKeys([
  'count_rejected',
  'count_targeted'
]);

export function refreshRejectionReport(updates = {}) {
  return (dispatch, getState) => {
    const { reportFilters } = getState();

    updates.metrics = REJECTION_METRICS;
    const options = buildCommonOptions(reportFilters, updates);
    const params = getQueryFromOptions(options);

    dispatch(refreshReportRange(options));

    return Promise.all([
      dispatch(fetchRejectionReasonsByDomain(params)),
      dispatch(fetchDeliverability({
        type: 'GET_REJECTION_AGGREGATES',
        params
      }))
    ]);
  };
}
