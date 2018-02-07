const initialState = {
  grants: []
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'GET_CURRENT_USER_SUCCESS':
      return { ...state, ...payload };

    case 'GET_GRANTS_SUCCESS':
      return { ...state, grants: payload };

    default:
      return state;
  }
};
