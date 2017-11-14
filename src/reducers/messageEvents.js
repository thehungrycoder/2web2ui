const initialState = {
  pending: false,
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

    default:
      return state;
  }
};
