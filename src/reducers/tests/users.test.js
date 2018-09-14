import cases from 'jest-in-case';
import usersReducer, { initialState } from '../users';

const state = {
  ...initialState,
  entities: {
    'test-user-one': {
      access: 'admin',
      is_sso: false,
      username: 'test-user-one'
    },
    'test-user-two': {
      access: 'reporting',
      is_sso: false,
      username: 'test-user-two'
    }
  }
};

const TEST_CASES = {
  'removes user from entities': {
    type: 'DELETE_USER_SUCCESS',
    meta: { data: { username: 'test-user-two' }}
  },
  'ignores update for unknown user': {
    type: 'UPDATE_USER_SUCCESS',
    meta: { data: { username: 'unknown-user' }}
  },
  'updates users access level from admin to reporting': {
    type: 'UPDATE_USER_SUCCESS',
    meta: {
      data: {
        access_level: 'reporting',
        username: 'test-user-one'
      }
    }
  },
  'updates users is_sso from false to true': {
    type: 'UPDATE_USER_SUCCESS',
    meta: {
      data: {
        is_sso: true,
        username: 'test-user-one'
      }
    }
  }
};

cases('Users reducer', (action) => {
  expect(usersReducer(state, action)).toMatchSnapshot();
}, TEST_CASES);
