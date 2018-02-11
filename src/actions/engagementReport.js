import * as metrics from 'src/actions/metrics';
import { refreshReportRange } from 'src/actions/reportFilters';
import { getQueryFromOptions, buildCommonOptions } from 'src/helpers/metrics';

const getAggregateAction = (params) => ({
  params: {
    ...params,
    metrics: 'count_accepted,count_targeted,count_unique_clicked_approx,count_unique_confirmed_opened_approx'
  },
  path: 'deliverability',
  type: 'GET_ENGAGEMENT_AGGREGATE_METRICS'
});

const getLinkNamesAction = (params) => ({
  params: {
    ...params,
    metrics: 'count_clicked,count_raw_clicked_approx'
  },
  path: 'deliverability/link-name',
  type: 'GET_ENGAGEMENT_LINK_METRICS'
});

export function getEngagementMetrics(updates = {}, { getMetrics = metrics.fetch } = {}) {
  return (dispatch, getState) => {
    const options = buildCommonOptions(getState().reportFilters, updates);
    const query = getQueryFromOptions(options);
    dispatch(refreshReportRange(options));

    return Promise.all([
      dispatch(getMetrics(getAggregateAction(query))),
      dispatch(getMetrics(getLinkNamesAction(query)))
    ]);
  };
}
