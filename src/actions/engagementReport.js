import * as metrics from 'src/actions/metrics';
import { getQueryFromOptions } from 'src/helpers/metrics';

export function getChartData({ getMetrics = metrics.fetch } = {}) {
  return (dispatch, getState) => {
    const params = getQueryFromOptions(getState().reportFilters);

    return dispatch(getMetrics({
      params: {
        ...params,
        metrics: 'count_accepted,count_targeted,count_unique_clicked_approx,count_unique_confirmed_opened_approx'
      },
      path: 'deliverability',
      type: 'GET_ENGAGEMENT_CHART_DATA'
    }));
  };
}
