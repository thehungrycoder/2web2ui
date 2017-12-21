import _ from 'lodash';

import { fetchRejectionReasonsByDomains } from 'src/actions/metrics';
import { refreshReportRange } from 'src/actions/reportFilters';

import { getQueryFromOptions } from 'src/helpers/metrics';
import { getRelativeDates } from 'src/helpers/date';


//TODO Replace this with the implementation in src/helpers/metrics.js after FAD-5592 gets merged
function buildCommonOptions(reportFilters, updates = {}) {
  return {
    ...reportFilters,
    ...updates,
    ...getRelativeDates(updates.relativeRange)
  };
}

export function refreshRejectionsTable({ reasons }) {
  return {
    type: 'REFRESH_REJECTION_BY_DOMAIN_TABLE',
    payload: { reasons }
  };
}

export function refreshRejectionTableMetrics(updates = {}) {
  return (dispatch, getState) => {
    const { reportFilters } = getState();
    const options = buildCommonOptions(reportFilters, updates);
    const query = getQueryFromOptions(options);
    const params = _.omit(query, ['precision', 'metrics']);
    dispatch(refreshReportRange(options));
    return dispatch(fetchRejectionReasonsByDomains(params))
      .then((reasons) => {
        dispatch(refreshRejectionsTable({ reasons }));
      });

  };
}
