import * as metrics from 'src/actions/metrics';

export function getChartData({ getMetrics = metrics.fetch } = {}) {
  return getMetrics({
    params: {
      delimiter: ',',
      from: '2018-01-10T15:00',
      metrics: 'count_accepted,count_targeted,count_unique_clicked_approx,count_unique_confirmed_opened_approx',
      to: '2018-01-11T15:40'
    },
    path: 'deliverability',
    type: 'GET_ENGAGEMENT_CHART_DATA'
  });
}
