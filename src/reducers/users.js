import fp from 'lodash/fp';

const initialState = {
  entities: {},
  error: null,
  loading: false,
  sortKey: 'name'
};

const reduceUsers = fp.reduce((result, user) => ({ ...result, [user.username]: user }), {});

export default (state = initialState, action) => {
  switch (action.type) {
    case 'LIST_USERS_FAIL':
      return { ...initialState, error: action.payload };
    case 'LIST_USERS_PENDING':
      return { ...initialState, loading: true };
    case 'LIST_USERS_SUCCESS':
      return { ...initialState, entities: reduceUsers(action.payload) };

    default:
      return state;
  }
};
