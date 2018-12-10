import moment from 'moment';
import config from 'src/config';
import _ from 'lodash';
import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';

const { apiDateFormat, messageEvents: { retentionPeriodDays }} = config;

export function getMessageEvents(options = {}) {
  const { dateOptions, searchQueries, ...rest } = options;
  const { from, to } = dateOptions;
  const params = {};
  if (from) {
    params.from = moment(from).utc().format(apiDateFormat);
  }

  if (to) {
    params.to = moment(to).utc().format(apiDateFormat);
  }

  if (rest.events.length > 0) {
    params.events = rest.events.join(',');
  }

  _.forEach(rest, (value, key) => {
    if (!_.isEmpty(value)) {
      params[key] = value.join(',');
    }
  });

  //console.log('params',params);
  return sparkpostApiRequest({
    type: 'GET_EVENTS',
    meta: {
      method: 'GET',
      url: '/v1/message-events',
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
    type: 'REFRESH_EVENTS_DATE_OPTIONS',
    payload: dateOptions
  };
}

/**
 * Overwrites filters options
 */
export function updateMessageEventsSearchOptions({ dateOptions, ...options }) {
  return {
    type: 'REFRESH_EVENTS_SEARCH_OPTIONS',
    payload: { dateOptions, ...options }
  };
}

/**
 * Appends additional filter options to existing options
 */
export function addFilters(filters) {
  return {
    type: 'ADD_EVENTS_FILTERS',
    payload: filters
  };
}

export function removeFilter(filter) {
  return {
    type: 'REMOVE_EVENTS_FILTER',
    payload: filter
  };
}

export function getMessageHistory({ messageId }) {
  return sparkpostApiRequest({
    type: 'GET_HISTORY',
    meta: {
      method: 'GET',
      url: '/v1/message-events',
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
    type: 'GET_EVENTS_DOCUMENTATION',
    meta: {
      method: 'GET',
      url: '/v1/message-events/events/documentation',
      showErrorAlert: false
    }
  });
}
