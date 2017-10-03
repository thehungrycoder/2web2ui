import fp from 'lodash/fp';

export const initialState = {
  entities: {},
  error: null,
  loading: false,
  sortKey: 'name'
};

const reduceUsers = fp.reduce((result, user) => ({ ...result, [user.username]: user }), {});

export default (state = initialState, action) => {
  switch (action.type) {
    case 'DELETE_USER_SUCCESS': {
      const { username } = action.meta.data;
      return fp.omit([['entities', username]])(state);
    }

    case 'LIST_USERS_FAIL':
      return { ...initialState, error: action.payload };
    case 'LIST_USERS_PENDING':
      return { ...initialState, loading: true };
    case 'LIST_USERS_SUCCESS':
      return { ...initialState, entities: reduceUsers(action.payload) };

    case 'UPDATE_USER_SUCCESS': {
      const { access_level, username } = action.meta.data;
      const user = fp.get(username)(state.entities);

      if (fp.isUndefined(user)) { return state; } // ignore

      return fp.set(['entities', username, 'access'], access_level)(state);
    }

    default:
      return state;
  }
};
