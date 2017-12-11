import _ from 'lodash';
import { fetchDelayReasonsByDomain } from 'src/actions/metrics';
import { refreshReportRange } from 'src/actions/reportFilters';

import { getQueryFromOptions, buildCommonOptions } from 'src/helpers/metrics';

export function refreshDelayTable({ reasons }) {
  return {
    type: 'REFRESH_DELAY_TABLE',
    payload: { reasons }
  };
}

export function loadDelayReasonsByDomain(updates = {}) {
  return (dispatch, getState) => {
    const { reportFilters } = getState();
    const options = buildCommonOptions(reportFilters, updates);
    const query = getQueryFromOptions(options);
    const params = _.omit(query, ['precision', 'metrics']);

    dispatch(refreshReportRange(options));

    return dispatch(fetchDelayReasonsByDomain(params))
      .then((reasons) => {
        dispatch(refreshDelayTable({ reasons }));
      });
  };
}
