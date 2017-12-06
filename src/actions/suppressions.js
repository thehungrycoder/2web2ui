import moment from 'moment';
import config from 'src/config';
import _ from 'lodash';
import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';
import { refreshReportRange } from 'src/actions/reportFilters';

const { apiDateFormat } = config;

export function checkSuppression() { //used in DashBoardPage to check if account has suppression
  const params = { sources: 'Manually Added', limit: 1 };

  return (dispatch, getState) => dispatch(
    sparkpostApiRequest({
      type: 'CHECK_SUPPRESSIONS',
      meta: {
        method: 'GET',
        url: '/suppression-list',
        params
      }
    })
  );
}

export function searchRecipient({ email, subaccountId } = {}) {
  const headers = {};
  if (subaccountId) {
    headers['x-msys-subaccount'] = subaccountId;
  }

  return (dispatch, getState) => dispatch(
      sparkpostApiRequest({
        type: 'SEARCH_SUPPRESSIONS_RECIPIENT',
        meta: {
          method: 'GET',
          url: `/suppression-list/${email}`,
          headers
        }
      })
    );
}

export function listSuppressions(options) {
  const { reportFilters, types = [], sources = []} = options;
  const { from, to } = reportFilters;

  const params = {};

  if (from) {
    params.from = moment(from).utc().format(apiDateFormat);
  }

  if (to) {
    params.to = moment(to).utc().format(apiDateFormat);
  }

  if (!_.isEmpty(types)) {
    params.types = types.join(',');
  }

  if (!_.isEmpty(sources)) {
    params.sources = sources.join(',');
  }

  return (dispatch, getState) => {
    dispatch(refreshReportRange(reportFilters));

    return dispatch(
      sparkpostApiRequest({
        type: 'GET_SUPPRESSIONS',
        meta: {
          method: 'GET',
          url: '/suppression-list',
          params
        }
      })
    );
  };
}
