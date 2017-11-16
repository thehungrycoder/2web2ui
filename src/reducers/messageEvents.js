import { formatDocumentation } from 'src/helpers/messageEvents';

const initialState = {
  pending: false,
  documentationPending: false,
  error: null,
  events: [],
  history: {}
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'GET_MESSAGE_EVENTS_PENDING':
      return { ...state, pending: true, error: null };

    case 'GET_MESSAGE_EVENTS_SUCCESS':
      return { ...state, pending: false, events: payload };

    case 'GET_MESSAGE_EVENTS_FAIL':
      return { ...state, pending: false, error: payload };

    case 'GET_MESSAGE_HISTORY_SUCCESS':
      return {
        ...state,
        history: { ...state.history, [payload.messageId]: payload.history }
      };

    case 'GET_MESSAGE_EVENTS_DOCUMENTATION_PENDING':
      return { ...state, documentationPending: true, error: null };

    case 'GET_MESSAGE_EVENTS_DOCUMENTATION_SUCCESS':
      return { ...state, documentationPending: false, documentation: formatDocumentation(payload) };

    case 'GET_MESSAGE_EVENTS_DOCUMENTATION_FAIL':
      return { ...state, documentationPending: false, error: payload };

    default:
      return state;
  }
};
