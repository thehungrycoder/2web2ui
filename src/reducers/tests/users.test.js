import usersReducer, { initialState } from '../users';

it('returns state without deleted user', () => {
  const action = {
    type: 'DELETE_USER_SUCCESS',
    meta: {
      data: {
        username: 'test-user',
      }
    }
  }
  const state = {
    ...initialState,
    entities: {
      'test-user': {
        username: 'test-user',
      }
    }
  }

  expect(usersReducer(state, action)).not.toHaveProperty('entities.test-user');
})
