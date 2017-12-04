import moment from 'moment';
import config from 'src/config';

import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';
const { apiDateFormat } = config;


export function listSuppressions(params) {
  return sparkpostApiRequest({
    type: 'GET_SUPPRESSIONS',
    meta: {
      method: 'GET',
      url: '/suppression-list',
      params: params
    }
  });
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

export function searchSuppressions({ from, to, types, sources } = {}) {
  const params = {
    from: moment(from).utc().format(apiDateFormat),
    to: moment(to).utc().format(apiDateFormat),
    types,
    sources
  };

  return (dispatch, getState) => dispatch(
      sparkpostApiRequest({
        type: 'SEARCH_SUPPRESSIONS',
        meta: {
          method: 'GET',
          url: '/suppression-list',
          params
        }
      })
    );
}

