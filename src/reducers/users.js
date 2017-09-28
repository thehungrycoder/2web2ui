import _ from 'lodash';

const initialState = {
  list: [],
  error: null,
  loading: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'LIST_USERS_FAIL':
      return { ...initialState, error: action.payload };
    case 'LIST_USERS_PENDING':
      return { ...initialState, loading: true };
    case 'LIST_USERS_SUCCESS':
      return { ...initialState, list: _.sortBy(action.payload, ['name']) };

    default:
      return state;
  }
};
