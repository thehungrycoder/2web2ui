import moment from 'moment';
import config from 'src/config';
import _ from 'lodash';
import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';
import qs from 'query-string';

const { apiDateFormat, messageEvents: { retentionPeriodDays }} = config;

export function getMessageEvents(options = {}) {
  const { dateOptions, perPage, ...rest } = options;
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

  params.per_page = perPage ? perPage : 25;

  return sparkpostApiRequest({
    type: 'GET_MESSAGE_EVENTS',
    meta: {
      method: 'GET',
      url: '/v1/events/message',
      params,
      showErrorAlert: false
    }
  });
}

export function changePage(currentPage) {
  return (dispatch, getState) => {
    const { linkByPage, cachedResultsByPage } = getState().messageEvents;
    const currentPageIndex = currentPage - 1;
    const params = qs.parse(linkByPage[currentPageIndex]);

    if (cachedResultsByPage[currentPageIndex]) {
      dispatch({
        type: 'LOAD_EVENTS_FROM_CACHE',
        payload: currentPageIndex
      });
    }

    dispatch(sparkpostApiRequest({
      type: 'GET_MESSAGE_EVENTS_PAGE',
      meta: {
        method: 'GET',
        url: '/v1/events/message',
        params,
        showErrorAlert: false,
        currentPageIndex
      }
    }));
  };
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
      url: '/v1/events/message',
      params: {
        messages: messageId,
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
      url: '/v1/events/message/documentation',
      showErrorAlert: false
    }
  });
}
