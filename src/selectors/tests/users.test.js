import { selectUsers, selectUserById } from '../users';

describe('Users Selectors', () => {
  const state = {
    currentUser: { username: 'zebra' },
    users: {
      entities: {
        ape: { name: 'Ape', username: 'ape' },
        zebra: { name: 'Zebra', username: 'zebra' }
      },
      sortKey: 'name'
    }
  };

  it('returns enriched and sorted list', () => {
    expect(selectUsers(state)).toMatchSnapshot();
  });

  it('returns user from user list', () => {
    expect(selectUserById(state, 'ape')).toMatchSnapshot();
  });
});
