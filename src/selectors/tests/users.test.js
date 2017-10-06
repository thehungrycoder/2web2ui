import { selectUsers } from '../users';

describe('Users Selectors', () => {
  const store = {
    currentUser: { username: 'zebra' },
    users: {
      entities: [
        { name: 'Zebra', username: 'zebra' },
        { name: 'Ape', username: 'ape' }
      ],
      sortKey: 'name'
    }
  };

  it('returns enriched and sorted list', () => {
    expect(selectUsers(store)).toMatchSnapshot();
  });
});
