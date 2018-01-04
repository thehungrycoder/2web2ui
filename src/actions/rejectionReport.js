import _ from 'lodash';

import { fetchRejectionReasonsByDomain } from 'src/actions/metrics';
import { refreshReportRange } from 'src/actions/reportFilters';
import { getQueryFromOptions, buildCommonOptions } from 'src/helpers/metrics';

function refreshRejectionsTable(reasons) {
  return {
    type: 'REFRESH_REJECTION_BY_DOMAIN_TABLE',
    payload: { reasons }
  };
}

export function refreshRejectionTableMetrics(updates = {}) {
  return (dispatch, getState) => {
    const { reportFilters } = getState();
    const unsupportedParams = ['precision', 'metrics'];

    const options = buildCommonOptions(reportFilters, updates);
    const query = getQueryFromOptions(options);

    const params = _.omit(query, unsupportedParams);
    dispatch(refreshReportRange(options));
    return dispatch(fetchRejectionReasonsByDomain(params))
      .then((reasons) => {
        dispatch(refreshRejectionsTable(reasons));
      });

  };
}
