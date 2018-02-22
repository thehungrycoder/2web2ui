import { fetchDeliverability, fetchDelayReasonsByDomain } from 'src/actions/metrics';
import { getQueryFromOptions } from 'src/helpers/metrics';

export function refreshDelayReport(updates = {}) {
  return (dispatch) => {
    const params = getQueryFromOptions(updates);

    return Promise.all([
      dispatch(fetchDeliverability({
        type: 'GET_DELAY_REPORT_AGGREGATES',
        params: {
          ...params,
          metrics: 'count_accepted,count_delayed,count_delayed_first'
        }
      })),
      dispatch(fetchDelayReasonsByDomain(params))
    ]);
  };

}
