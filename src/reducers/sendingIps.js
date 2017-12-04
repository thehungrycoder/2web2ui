const initialState = {
  list: []
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'LIST_SENDING_IPS_SUCCESS':
      return { ...state, list: payload };

    default:
      return state;
  }
};
