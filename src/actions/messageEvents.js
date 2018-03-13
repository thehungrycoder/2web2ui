import moment from 'moment';
import config from 'src/config';
import _ from 'lodash';
import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';

const { apiDateFormat, messageEvents } = config;

export function getMessageEvents(options = {}) {
  const { dateOptions, recipients } = options;
  const { from, to } = dateOptions;
  const params = {};

  if (from) {
    params.from = moment(from).utc().format(apiDateFormat);
  }

  if (to) {
    params.to = moment(to).utc().format(apiDateFormat);
  }

  if (!_.isEmpty(recipients)) {
    params.recipients = recipients.join(',');
  }

  return sparkpostApiRequest({
    type: 'GET_MESSAGE_EVENTS',
    meta: {
      method: 'GET',
      url: '/message-events',
      params,
      showErrorAlert: false
    }
  });
}


/**
 * Refreshes the date range for message events
 *
 * Calculates relative ranges if a non-custom relativeRange value is present,
 * which will override passed in from/to dates
 *
 * @param {Object} dateOptions
 * @param {Date} dateOptions.from
 * @param {Date} dateOptions.to
 * @param {String} dateOptions.relativeRange
 */
export function refreshMessageEventsDateRange(dateOptions) {
  return {
    type: 'REFRESH_MESSAGE_EVENTS_DATE_OPTIONS',
    payload: dateOptions
  };
}

export function updateMessageEventsSearchOptions(options) {
  return {
    type: 'REFRESH_MESSAGE_EVENTS_SEARCH_OPTIONS',
    payload: options
  };
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
