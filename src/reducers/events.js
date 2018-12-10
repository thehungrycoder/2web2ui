import { formatDocumentation, getFiltersFromSearchQueries, getSearchQueriesFromFilters, getEmptyFilters } from 'src/helpers/events';
import { getRelativeDates } from 'src/helpers/date';
import _ from 'lodash';
const emptyFilters = getEmptyFilters();
const initialState = {
  loading: false,
  historyLoading: false,
  documentationLoading: false,
  error: null,
  events: [],
  history: {},
  search: {
    dateOptions: {
      relativeRange: 'hour'
    },
    recipients: [],
    events: [],
    searchQueries: [],
    ...emptyFilters
  }
};

export default (state = initialState, { type, payload, meta }) => {

  switch (type) {

    case 'GET_EVENTS_PENDING':
      return { ...state, loading: true, error: null };

    case 'GET_EVENTS_SUCCESS':
      return { ...state, loading: false, events: payload };

    case 'GET_EVENTS_FAIL':
      return { ...state, loading: false, error: payload };


      // History

    case 'GET_EVENTS_HISTORY_PENDING':
      return { ...state, historyLoading: true, error: null };

    case 'GET_EVENTS_HISTORY_SUCCESS':
      return {
        ...state,
        historyLoading: false,
        history: { ...state.history, [meta.params.message_ids]: payload }
      };

    case 'GET_EVENTS_HISTORY_FAIL':
      return { ...state, historyLoading: false, error: payload };


      // Documentation

    case 'GET_EVENTS_DOCUMENTATION_PENDING':
      return { ...state, documentationLoading: true, error: null };

    case 'GET_EVENTS_DOCUMENTATION_SUCCESS':
      return { ...state, documentationLoading: false, documentation: formatDocumentation(payload) };

    case 'GET_EVENTS_DOCUMENTATION_FAIL':
      return { ...state, documentationLoading: false, error: payload };


      // Search options

    case 'REFRESH_EVENTS_DATE_OPTIONS': {
      const dateOptions = { ...state.search.dateOptions, ...payload, ...getRelativeDates(payload.relativeRange, false) };
      return { ...state, search: { ...state.search, dateOptions }};
    }

    case 'REFRESH_EVENTS_SEARCH_OPTIONS': {
      const { dateOptions, ...options } = payload;
      const updatedFilters = getFiltersFromSearchQueries(options);
      return { ...state, search: { ...state.search,dateOptions: { ...state.search.dateOptions, ...dateOptions }, ...options, ...updatedFilters }};
    }

    case 'ADD_EVENTS_FILTERS': {
      const updatedSearch = {};
      _.keys(payload).map((key) => {
        updatedSearch[key] = _.uniq([ ...state.search[key], ...payload[key]]);
      });
      return { ...state, search: { ...state.search, ...updatedSearch }};
    }

    case 'REMOVE_EVENTS_FILTER': {
      const updatedSearch = {};
      updatedSearch[payload.key] = state.search[payload.key].filter((listItem) => payload.item !== listItem);
      const search = { ...state.search, ...updatedSearch };
      const searchQueries = getSearchQueriesFromFilters(search);
      return { ...state, search: { ...search, searchQueries }};
    }

    default:
      return state;
  }
};
