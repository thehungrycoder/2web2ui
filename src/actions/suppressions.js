import moment from 'moment';
import config from 'src/config';
import _ from 'lodash';
import localFileParseRequest, { hasData, hasField } from 'src/actions/helpers/localFileParseRequest';
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

const LIKE_NON = new RegExp('non', 'i');
const LIKE_TRUE = new RegExp('true', 'i');

// SEE: https://developers.sparkpost.com/api/suppression-list.html#suppression-list-bulk-insert-update-put
export function createOrUpdateSuppressions(recipients, subaccount) {
  const sanitizedRecipients = recipients.map(({
    description, email, non_transactional, recipient, transactional, type
  }) => {
    // Convert deprecated type fields
    if (!type && LIKE_TRUE.test(transactional)) { type = 'transactional'; }
    if (!type && LIKE_TRUE.test(non_transactional)) { type = 'non_transactional'; }

    // Format type value to provide a better user experience
    if (type && LIKE_NON.test(type)) { type = 'non_transactional'; }
    if (type && !LIKE_NON.test(type)) { type = 'transactional'; }

    // Convert deprecated recipient fields
    if (email) { recipient = email; }

    // Trim whitespace from recipient email
    if (recipient) { recipient = _.trim(recipient); } // for FAD-5095

    return { description, recipient, type };
  });

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
      file,
      validate: [
        hasData,
        hasField('recipient', 'email'),
        hasField('type', 'non_transactional', 'transactional')
      ]
    }
  });
}

export function uploadSuppressions(file, subaccount) {
  return async(dispatch) => {
    const recipients = await dispatch(parseSuppressionsFile(file));
    return dispatch(createOrUpdateSuppressions(recipients, subaccount));
  };
}
