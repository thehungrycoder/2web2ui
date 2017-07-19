export default (state = {}, { type, payload, meta }) => {
  switch (type) {
    case 'API_FAILURE_RECEIVED':
      return { ...state, error: payload, request: meta };

    case 'API_FAILURE_CLEARED':
      return {};

    default:
      return state;
  }
};
