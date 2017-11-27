import { snakeToFriendly, snakeToCamel, slugify } from '../string';

describe('snakeToFrindly', () => {
  it('should properly format a snaked cased string', () => {
    expect(snakeToFriendly('a_cool_string')).toEqual('A Cool String');
  });
});

describe('snakeToCamel', () => {
  it('should properly format a snaked cased string', () => {
    expect(snakeToCamel('a_cool_string')).toEqual('aCoolString');
  });
});

describe('slugify', () => {
  it('should properly format a string', () => {
    expect(slugify('one Two  3')).toEqual('one-two-3');
  });
});
