import moment from 'moment';
import config from 'src/config';
import _ from 'lodash';

import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';
import { refreshReportRange } from 'src/actions/reportFilters';
import { showAlert } from './globalAlert';

const { apiDateFormat } = config;

export function getMessageEvents(options = {}) {
  const { reportFilters, recipients } = options;
  const { from, to } = reportFilters;

  const params = {};

  if (from) {
    params.from = moment(from).utc().format(apiDateFormat);
  }

  if (to) {
    params.to = moment(to).utc().format(apiDateFormat);
  }

  if (!_.isEmpty(recipients)) {
    params.recipients = recipients;
  }

  return (dispatch, getState) => {
    dispatch(refreshReportRange(reportFilters));

    return dispatch(
      sparkpostApiRequest({
        type: 'GET_MESSAGE_EVENTS',
        meta: {
          method: 'GET',
          url: '/message-events',
          params
        }
      }))
      .catch((err) => {
        dispatch(
          showAlert({
            type: 'error',
            message: 'Error while loading message events',
            details: err.message
          })
        );
      });
  };
}

export function getMessageHistory({ messageId, params = {}}) {
  return sparkpostApiRequest({
    type: 'GET_MESSAGE_HISTORY',
    meta: {
      method: 'GET',
      url: '/message-events',
      params: {
        to: moment().utc().format(apiDateFormat),
        ...params,
        message_ids: messageId,
        from: moment().subtract(10, 'days').utc().format(apiDateFormat)
      }
    }
  });
}

export function getDocumentation() {
  return sparkpostApiRequest({
    type: 'GET_MESSAGE_EVENTS_DOCUMENTATION',
    meta: {
      method: 'GET',
      url: '/message-events/events/documentation'
    }
  });
}
