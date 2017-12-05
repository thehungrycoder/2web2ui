import fp from 'lodash/fp';

export const initialState = {
  entities: {},
  error: null,
  loading: false,
  sortKey: 'name',
  inviteError: null
};

const reduceUsers = fp.reduce((result, user) => ({ ...result, [user.username]: user }), {});

export default (state = initialState, action) => {
  switch (action.type) {
    case 'INVITE_USER_FAIL':
      return { ...state, error: action.payload };

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

    case 'REGISTER_USER_PENDING':
      return { ...initialState, error: null, loading: true };

    case 'REGISTER_USER_SUCCESS':
      return { ...initialState, loading: false };

    case 'REGISTER_USER_FAIL':
      return { ...initialState, error: action.payload, loading: false };

    case 'CHECK_INVITE_TOKEN_PENDING':
      return { ...initialState, inviteError: null, loading: true };

    case 'CHECK_INVITE_TOKEN_SUCCESS':
      return { ...initialState, loading: false };

    case 'CHECK_INVITE_TOKEN_FAIL':
      return { ...initialState, inviteError: action.payload, loading: false };

    default:
      return state;
  }
};
