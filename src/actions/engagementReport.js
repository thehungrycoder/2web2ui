import * as metrics from 'src/actions/metrics';
import { getQueryFromOptions } from 'src/helpers/metrics';

export function getAggregateMetrics({ getMetrics = metrics.fetch } = {}) {
  return (dispatch, getState) => {
    const params = getQueryFromOptions(getState().reportFilters);

    return dispatch(getMetrics({
      params: {
        ...params,
        metrics: 'count_accepted,count_targeted,count_unique_clicked_approx,count_unique_confirmed_opened_approx'
      },
      path: 'deliverability',
      type: 'GET_ENGAGEMENT_AGGREGATE_METRICS'
    }));
  };
}

export function getLinkMetrics({ getMetrics = metrics.fetch } = {}) {
  return (dispatch, getState) => {
    const params = getQueryFromOptions(getState().reportFilters);

    return dispatch(getMetrics({
      params: {
        ...params,
        metrics: 'count_clicked,count_raw_clicked_approx'
      },
      path: 'deliverability/link-name',
      type: 'GET_ENGAGEMENT_LINK_METRICS'
    }));
  };
}
