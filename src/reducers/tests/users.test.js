import cases from 'jest-in-case';
import usersReducer, { initialState } from '../users';

const state = {
  ...initialState,
  entities: {
    'test-user-one': {
      access: 'admin',
      username: 'test-user-one'
    },
    'test-user-two': {
      access: 'reporting',
      username: 'test-user-two'
    }
  }
};

const TEST_CASES = {
  'removes user from entities': {
    type: 'DELETE_USER_SUCCESS',
    meta: { data: { username: 'test-user-two' } }
  },
  'ignores update for unknown user': {
    type: 'UPDATE_USER_SUCCESS',
    meta: { data: { username: 'unknown-user' } }
  },
  'updates users access level from admin to reporting': {
    type: 'UPDATE_USER_SUCCESS',
    meta: {
      data: {
        access_level: 'reporting',
        username: 'test-user-one'
      }
    }
  }
};

cases('Users reducer', (action) => {
  expect(usersReducer(state, action)).toMatchSnapshot();
}, TEST_CASES);
