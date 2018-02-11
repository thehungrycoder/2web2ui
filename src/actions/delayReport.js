import { fetch as getMetrics } from 'src/actions/metrics';
import { refreshReportRange } from 'src/actions/reportFilters';
import { getQueryFromOptions, buildCommonOptions, getMetricsFromKeys } from 'src/helpers/metrics';

const DELAY_METRICS = getMetricsFromKeys([
  'count_accepted',
  'count_delayed',
  'count_delayed_first'
]);

export function getDelayMetrics(updates = {}) {
  return (dispatch, getState) => {
    const options = buildCommonOptions(getState().reportFilters, updates);
    options.metrics = DELAY_METRICS;
    const params = getQueryFromOptions(options);

    dispatch(refreshReportRange(options));

    return Promise.all([
      dispatch(getMetrics({
        type: 'GET_DELAY_REPORT_AGGREGATES',
        path: 'deliverability',
        params
      })),
      dispatch(getMetrics({
        type: 'GET_DELAY_REPORT_REASONS_BY_DOMAIN',
        path: 'deliverability/delay-reason/domain',
        params
      }))
    ]);
  };

}
