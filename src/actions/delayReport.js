import _ from 'lodash';
import { fetch as getMetrics } from 'src/actions/metrics';
import { refreshReportRange } from 'src/actions/reportFilters';
import { getQueryFromOptions, buildCommonOptions, getMetricsFromKeys } from 'src/helpers/metrics';

const DELAY_METRICS = getMetricsFromKeys([
  'count_accepted',
  'count_delayed',
  'count_delayed_first'
]);

export function getDelayMetrics({ precision, ...updates } = {}) {
  return (dispatch, getState) => {
    const options = buildCommonOptions(getState().reportFilters, updates);

    const reasonParams = _.omit(getQueryFromOptions(options), ['precision', 'metrics']);
    const aggregateParams = _.omit(getQueryFromOptions({ ...options, metrics: DELAY_METRICS }), 'precision');

    dispatch(refreshReportRange(options));

    return Promise.all([
      dispatch(getMetrics({
        type: 'GET_DELAY_REPORT_AGGREGATES',
        path: 'deliverability',
        params: aggregateParams
      })),
      dispatch(getMetrics({
        type: 'GET_DELAY_REPORT_REASONS_BY_DOMAIN',
        path: 'deliverability/delay-reason/domain',
        params: reasonParams
      }))
    ]);
  };

}
