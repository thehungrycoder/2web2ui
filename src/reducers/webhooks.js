const initialState = { list: [] };

export default (state = initialState, action) => {
  switch (action.type) {
    case 'LIST_WEBHOOKS_SUCCESS':
      return { ...state, list: action.payload };

    default:
      return state;
  }
};
