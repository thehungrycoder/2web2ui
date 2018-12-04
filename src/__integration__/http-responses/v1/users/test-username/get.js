export default ({ headers }) => {
  if (headers.Authorization !== 'mock-access-token') {
    return ({
      errors: [
        { message: 'Unauthorized.' }
      ]
    });
  }

  return ({
    results: {
      access_level: 'admin',
      username: 'test-username',
      first_name: 'Firsty',
      last_name: 'Lasty',
      email: 'test-email@example.com'
    }
  });
};
