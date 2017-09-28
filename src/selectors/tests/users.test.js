import { selectUsers } from '../users';

describe('Users List Selector', () => {
  let store = {
    users: {
      list: [
        { id: 1, name: 'Zebra' },
        { id: 2, name: 'Ape' },
      ],
    },
  };

  it('returns sorted list of users', () => {
    expect(selectUsers(store)).toMatchSnapshot();
  });

  it('returns empty array without a user list', () => {
    store.users.list = [];
    expect(selectUsers(store)).toMatchSnapshot();
  });
});
