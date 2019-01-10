import { formatDocumentation, getEmptyFilters } from 'src/helpers/messageEvents';
import { getRelativeDates } from 'src/helpers/date';
import _ from 'lodash';
import { EVENTS_SEARCH_FILTERS } from 'src/constants';

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
    ...getEmptyFilters(EVENTS_SEARCH_FILTERS)
  }
};

export default (state = initialState, { type, payload, meta }) => {

  switch (type) {

    case 'GET_MESSAGE_EVENTS_PENDING':
      return { ...state, loading: true, error: null };

    case 'GET_MESSAGE_EVENTS_SUCCESS':
      return { ...state, loading: false, events: payload };

    case 'GET_MESSAGE_EVENTS_FAIL':
      return { ...state, loading: false, error: payload };


      // History

    case 'GET_MESSAGE_HISTORY_PENDING':
      return { ...state, historyLoading: true, error: null };

    case 'GET_MESSAGE_HISTORY_SUCCESS':
      return {
        ...state,
        historyLoading: false,
        history: { ...state.history, [meta.params.messages]: payload }
      };

    case 'GET_MESSAGE_HISTORY_FAIL':
      return { ...state, historyLoading: false, error: payload };


      // Documentation

    case 'GET_MESSAGE_EVENTS_DOCUMENTATION_PENDING':
      return { ...state, documentationLoading: true, error: null };

    case 'GET_MESSAGE_EVENTS_DOCUMENTATION_SUCCESS':
      return { ...state, documentationLoading: false, documentation: formatDocumentation(payload) };

    case 'GET_MESSAGE_EVENTS_DOCUMENTATION_FAIL':
      return { ...state, documentationLoading: false, error: payload };


      // Search options

    case 'REFRESH_MESSAGE_EVENTS_DATE_OPTIONS': {
      const dateOptions = { ...state.search.dateOptions, ...payload, ...getRelativeDates(payload.relativeRange, false) };
      return { ...state, search: { ...state.search, dateOptions }};
    }

    case 'REFRESH_MESSAGE_EVENTS_SEARCH_OPTIONS': {
      const { dateOptions, ...options } = payload;
      return { ...state, search: { ...state.search, dateOptions: { ...state.search.dateOptions, ...dateOptions }, ...options }};
    }

    case 'ADD_MESSAGE_EVENTS_FILTERS': {
      const updatedSearch = {};
      Object.keys(payload).map((key) => {
        updatedSearch[key] = _.uniq([ ...state.search[key], ...payload[key]]);
      });
      return { ...state, search: { ...state.search, ...updatedSearch }};
    }

    case 'REMOVE_MESSAGE_EVENTS_FILTER': {
      const updatedSearch = {};
      updatedSearch[payload.key] = state.search[payload.key].filter((listItem) => payload.item !== listItem);
      return { ...state, search: { ...state.search, ...updatedSearch }};
    }

    default:
      return state;
  }
};
