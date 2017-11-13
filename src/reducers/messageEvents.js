export default (state = { pending: false, error: null, results: []}, { type, payload }) => {
  switch (type) {
    case 'GET_MESSAGE_EVENTS_PENDING':
      return { ...state, pending: true, error: null };

    case 'GET_MESSAGE_EVENTS_SUCCESS':
      return { ...state, pending: false, events: payload };

    case 'GET_MESSAGE_EVENTS_FAIL':
      return { ...state, pending: false, error: payload };

    default:
      return state;
  }
};
