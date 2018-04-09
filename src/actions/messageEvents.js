import moment from 'moment';
import config from 'src/config';
import _ from 'lodash';
import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';

const { apiDateFormat, messageEvents: { retentionPeriodDays }} = config;

export function getMessageEvents(options = {}) {
  const { dateOptions, ...rest } = options;
  const { from, to } = dateOptions;
  const params = {};

  if (from) {
    params.from = moment(from).utc().format(apiDateFormat);
  }

  if (to) {
    params.to = moment(to).utc().format(apiDateFormat);
  }

  _.forEach(rest, (value, key) => {
    if (!_.isEmpty(value)) {
      params[key] = value.join(',');
    }
  });

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

/**
 * Overwrites filters options
 */
export function updateMessageEventsSearchOptions({ dateOptions, ...options }) {
  const updatedOptions = _.mapValues(options, (arr) => _.uniq(arr)); // Dedupes filter options
  return {
    type: 'REFRESH_MESSAGE_EVENTS_SEARCH_OPTIONS',
    payload: { dateOptions, ...updatedOptions }
  };
}

/**
 * Appends additional filter options to existing options
 */
export function addFilters(filters) {
  return {
    type: 'ADD_MESSAGE_EVENTS_FILTERS',
    payload: filters
  };
}

export function removeFilter(filter) {
  return {
    type: 'REMOVE_MESSAGE_EVENTS_FILTER',
    payload: filter
  };
}

export function getMessageHistory({ messageId }) {
  return sparkpostApiRequest({
    type: 'GET_MESSAGE_HISTORY',
    meta: {
      method: 'GET',
      url: '/message-events',
      params: {
        message_ids: messageId,
        // Must pass a time range because the defaults are too narrow (now to 24 hours ago) and
        // must cast a wide time range (even wider than the standard 10 day retention) to avoid
        // missing message events
        to: moment.utc().format(apiDateFormat),
        from: moment.utc().subtract(retentionPeriodDays, 'days').startOf('day').format(apiDateFormat)
      }
    }
  });
}

export function getDocumentation() {
  return sparkpostApiRequest({
    type: 'GET_MESSAGE_EVENTS_DOCUMENTATION',
    meta: {
      method: 'GET',
      url: '/message-events/events/documentation',
      showErrorAlert: false
    }
  });
}
