import * as metrics from 'src/actions/metrics';
import { refreshReportRange } from 'src/actions/reportFilters';
import { getQueryFromOptions, buildCommonOptions } from 'src/helpers/metrics';

export function refreshEngagementReport(updates = {}, { getMetrics = metrics.fetch } = {}) {
  return (dispatch, getState) => {
    const options = buildCommonOptions(getState().reportFilters, updates);
    const params = getQueryFromOptions(options);
    dispatch(refreshReportRange(options));

    return Promise.all([
      dispatch(getMetrics({
        params: {
          ...params,
          metrics: 'count_accepted,count_targeted,count_unique_clicked_approx,count_unique_confirmed_opened_approx'
        },
        path: 'deliverability',
        type: 'GET_ENGAGEMENT_AGGREGATE_METRICS'
      })),
      dispatch(getMetrics({
        params: {
          ...params,
          metrics: 'count_clicked,count_raw_clicked_approx'
        },
        path: 'deliverability/link-name',
        type: 'GET_ENGAGEMENT_LINK_METRICS'
      }))
    ]);
  };
}
