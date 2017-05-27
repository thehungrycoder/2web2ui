export default (state = {}, action) => {
  switch (action.type) {
    case 'FETCH_CURRENT_USER_SUCCESS':
      return action.payload;

    default:
      return state;
  }
};
