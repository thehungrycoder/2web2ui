import { fetch as getMetrics } from 'src/actions/metrics';
import { getQueryFromOptions } from 'src/helpers/metrics';

export function refreshEngagementReport(updates = {}) {
  return (dispatch) => {
    const params = getQueryFromOptions(updates);

    return Promise.all([
      dispatch(getMetrics({
        params: {
          ...params,
          metrics: 'count_accepted,count_sent,count_unique_clicked_approx,count_unique_confirmed_opened_approx'
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
