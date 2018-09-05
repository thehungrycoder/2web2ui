const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'WEBSITE_AUTH_SUCCESS':
      return {
        ...action.payload, // access_token, refresh_token, token_type
        ...state
      };
    default:
      return state;
  }
};
