import moment from 'moment';
import config from 'src/config';
import _ from 'lodash';
import localFileParseRequest from 'src/actions/helpers/localFileParseRequest';
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
  const { recipient, subaccount_id: subaccountId, type } = suppression;

  return sparkpostApiRequest({
    type: 'DELETE_SUPPRESSION',
    meta: {
      method: 'DELETE',
      url: `/suppression-list/${recipient}`,
      headers: setSubaccountHeader(subaccountId),
      data: { type },
      suppression
    }
  });
}

// SEE: https://github.com/SparkPost/sparkpost-api-documentation/blob/master/services/suppression-list.md#insert-or-update-list-entries-put
export function createOrUpdateSuppressions(recipients, subaccount) {
  const sanitizedRecipients = recipients.map((r) => _.mapValues(r, _.trim)); // for FAD-5095

  return sparkpostApiRequest({
    type: 'CREATE_OR_UPDATE_SUPPRESSIONS',
    meta: {
      method: 'PUT',
      url: '/suppression-list',
      headers: setSubaccountHeader(subaccount),
      data: {
        recipients: sanitizedRecipients
      }
    }
  });
}

export function parseSuppressionsFile(file) {
  return localFileParseRequest({
    type: 'PARSE_SUPPRESSIONS_FILE',
    meta: {
      file
    }
  });
}

export function uploadSuppressions(file, subaccount) {
  return async(dispatch) => {
    const recipients = await dispatch(parseSuppressionsFile(file));
    return dispatch(createOrUpdateSuppressions(recipients, subaccount));
  };
}
