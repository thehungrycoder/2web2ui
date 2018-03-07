import { formatDocumentation } from 'src/helpers/messageEvents';
import { getRelativeDates } from 'src/helpers/date';

const initialState = {
  loading: false,
  historyLoading: false,
  documentationLoading: false,
  error: null,
  events: [],
  history: {},
  search: {
    dateOptions: {},
    recipients: []
  }
};

export default (state = initialState, { type, payload }) => {

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
        history: { ...state.history, [payload[0].message_id]: payload }
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
      const dateOptions = { ...state.search.dateOptions, ...payload, ...getRelativeDates(payload.relativeRange) };
      return { ...state, search: { ...state.search, dateOptions }};
    }

    case 'REFRESH_MESSAGE_EVENTS_SEARCH_OPTIONS': {
      return { ...state, search: { ...state.search, ...payload }};
    }


    default:
      return state;
  }
};
