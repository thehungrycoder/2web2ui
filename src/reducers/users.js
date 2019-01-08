import fp from 'lodash/fp';

export const initialState = {
  entities: {},
  error: null,
  loading: false,
  sortKey: 'name',
  invite: {}
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

    case 'UPDATE_USER_PENDING':
      return { ...state, updatePending: true };

    case 'UPDATE_USER_FAIL':
      return { ...state, updatePending: false };

    case 'UPDATE_USER_SUCCESS': {
      const { access_level, is_sso, tfa_enabled, username } = action.meta.data;
      const user = fp.get(username)(state.entities);

      if (fp.isUndefined(user)) { return state; } // ignore

      return fp.set(['entities', username], {
        ...state.entities[username],
        access: access_level,
        is_sso,
        tfa_enabled
      })({ ...state, updatePending: false });
    }

    case 'REGISTER_USER_PENDING':
      return { ...state, loading: true };

    case 'REGISTER_USER_SUCCESS':
      return { ...state, loading: false };

    case 'REGISTER_USER_FAIL':
      return { ...state, loading: false };

    case 'CHECK_INVITE_TOKEN_PENDING':
      return { ...state, loading: true };

    case 'CHECK_INVITE_TOKEN_SUCCESS':
      return { ...state, invite: { ...action.payload }, loading: false };

    case 'CHECK_INVITE_TOKEN_FAIL':
      return { ...state, invite: { ...state.invite, error: action.payload }, loading: false };

    default:
      return state;
  }
};
