export default (state = { pending: false, error: null, results: []}, { type, payload }) => {
  switch (type) {
    case 'GET_MESSAGE_EVENTS_PENDING':
      return { ...state, pending: true };

    case 'GET_MESSAGE_EVENTS_SUCCESS':
      return { ...state, error: null, pending: false, events: payload };

    case 'GET_MESSAGE_EVENTS_FAIL':
      return { ...state, pending: false, error: payload };

    default:
      return state;
  }
};
