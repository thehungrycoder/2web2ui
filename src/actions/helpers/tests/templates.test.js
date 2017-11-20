import { getTestDataKey } from '../templates';

describe('Helper: Templates local storage key', () => {
  it('should get the correct draft key', () => {
    const options = { id: 'one', username: 'user', mode: 'draft' };
    const results = getTestDataKey(options);
    expect(results).toEqual('tpldata/user/one/d');
  });

  it('should get the correct published key', () => {
    const options = { id: 'two', username: 'user', mode: 'published' };
    const results = getTestDataKey(options);
    expect(results).toEqual('tpldata/user/two/p');
  });
});
