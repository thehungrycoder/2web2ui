import moment from 'moment';
import config from 'src/config';
import _ from 'lodash';
import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';
import setSubaccountHeader from 'src/actions/helpers/setSubaccountHeader';
import { refreshReportRange } from 'src/actions/reportFilters';
import { showAlert } from './globalAlert';

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
    }))
    .catch((err) => {
      const { response = {}} = err;
      if (response.status === 404) {
        return; //swallow 404s
      }

      dispatch(
        showAlert({
          type: 'error',
          message: 'Error while searching recipient in suppressions list',
          details: err.message
        })
      );
    });
}

export function searchSuppressions(options) {
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
      }))
      .catch((err) => {
        dispatch(
          showAlert({
            type: 'error',
            message: 'Error while searching suppressions list',
            details: err.message
          })
        );
      });
  };
}

export function deleteSuppression(suppression) {
  const { recipient, subaccount_id: subaccountId } = suppression;

  return (dispatch, getState) => dispatch(
    sparkpostApiRequest({
      type: 'DELETE_SUPPRESSION',
      meta: {
        method: 'DELETE',
        url: `/suppression-list/${recipient}`,
        headers: setSubaccountHeader(subaccountId),
        // data: { type },
        suppression
      }
    }));
}


// curl 'http://api.sparkpost.test/api/v1/suppression-list/9kkpz9c7t7o@comcast.net' -X DELETE -H 'Authorization: 4b9528c5e1965f9cb057356b6c95664679eea9d7'  -H 'x-msys-subaccount: 758' --data-binary '{"type":"non_transactional"}' --compressed
// curl 'https://api-uat.tst.sparkpost.com/api/v1/suppression-list/000sgd2l75sh2d@yahoo.com' -X DELETE -H 'authorization: 869f3f133f06c7f3d4dcef377d4e6f6c91f21109'  --compressed
