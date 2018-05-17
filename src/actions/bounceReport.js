import { fetchDeliverability, fetchBounceClassifications, fetchBounceReasonsByDomain } from 'src/actions/metrics';
import { getQueryFromOptions } from 'src/helpers/metrics';

export function refreshBounceReport (updates = {}) {
  return (dispatch) => {
    const params = getQueryFromOptions(updates);

    // get new data
    return Promise.all([
      dispatch(fetchDeliverability({
        type: 'GET_BOUNCE_REPORT_AGGREGATES',
        params: {
          ...params,
          metrics: 'count_sent,count_bounce,count_inband_bounce,count_outofband_bounce,count_admin_bounce'
        }
      })),
      dispatch(fetchBounceClassifications({
        ...params,
        metrics: 'count_bounce'
      })),
      dispatch(fetchBounceReasonsByDomain({
        ...params,
        metrics: 'count_bounce'
      }))
    ]);
  };
}
