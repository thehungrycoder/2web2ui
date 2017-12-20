const initialState = {
  grants: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'GET_CURRENT_USER_SUCCESS':
      return { ...state, ...action.payload };

    case 'GET_GRANTS_SUCCESS':
      return { ...state, grants: action.payload };

    case 'UPDATE_CURRENT_USER':
      return { ...state, ...action.payload };

    default:
      return state;
  }
};
