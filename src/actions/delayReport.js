import { fetchDeliverability, fetchDelayReasonsByDomain } from 'src/actions/metrics';
import { refreshReportRange } from 'src/actions/reportFilters';
import { getQueryFromOptions, buildCommonOptions } from 'src/helpers/metrics';

export function refreshDelayReport(updates = {}) {
  return (dispatch, getState) => {
    const options = buildCommonOptions(getState().reportFilters, updates);
    const params = getQueryFromOptions(options);

    dispatch(refreshReportRange(options));

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
