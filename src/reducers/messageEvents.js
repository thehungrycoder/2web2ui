import { formatDocumentation } from 'src/helpers/messageEvents';

const initialState = {
  loading: false,
  historyLoading: false,
  documentationLoading: false,
  error: null,
  events: [],
  history: {}
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
        // TODO: fix this https://sentry.io/sparkpost/alpha-web-ui-production/issues/435911822/
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

    default:
      return state;
  }
};
