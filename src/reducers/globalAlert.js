export default (state = {}, { type, payload }) => {
  switch (type) {
    case 'SHOW_GLOBAL_ALERT':
      return { ...state, ...payload };

    case 'CLEAR_GLOBAL_ALERT':
      return {};

    default:
      return state;
  }
};
