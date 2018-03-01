import moment from 'moment';
import config from 'src/config';
import _ from 'lodash';

import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';
import { showAlert } from './globalAlert';

const { apiDateFormat, messageEvents } = config;

export function getMessageEvents(options = {}) {
  const { reportOptions, recipients } = options;
  const { from, to } = reportOptions;

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

  return (dispatch) => dispatch(
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
}

export function getMessageHistory({ messageId, ...rest }) {
  return sparkpostApiRequest({
    type: 'GET_MESSAGE_HISTORY',
    meta: {
      method: 'GET',
      url: '/message-events',
      params: {
        to: moment().utc().format(apiDateFormat), // it's above ...rest so it can be overriden when needed
        ...rest,
        message_ids: messageId,
        from: moment().subtract(messageEvents.retentionPeriodDays, 'days').utc().format(apiDateFormat)
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
