import { fetchDeliverability, fetchBounceClassifications, fetchBounceReasonsByDomain } from 'src/actions/metrics';
import { refreshReportRange } from 'src/actions/reportFilters';
import { getQueryFromOptions, buildCommonOptions } from 'src/helpers/metrics';

export function refreshBounceReport(updates = {}) {
  return (dispatch, getState) => {
    const options = buildCommonOptions(getState().reportFilters, updates);
    dispatch(refreshReportRange(options));

    const params = getQueryFromOptions(options);
    delete params.precision;

    // get new data
    return Promise.all([
      dispatch(fetchDeliverability({
        type: 'GET_BOUNCE_REPORT_AGGREGATES',
        params: {
          ...params,
          metrics: 'count_targeted,count_bounce,count_inband_bounce,count_outofband_bounce'
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
