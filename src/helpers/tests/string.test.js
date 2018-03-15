import { snakeToFriendly, snakeToCamel, slugify, shrinkToFit, stringToArray } from '../string';

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

describe('shrinkToFit', () => {
  const shortStr = 'thisisatest';
  const longStr = 'antidisestablishmentarianism';
  it('should leave short strings intact', () => {
    expect(shrinkToFit(shortStr, shortStr.length + 1)).toEqual(shortStr);
  });

  it('should handle unrealistic target lengths', () => {
    expect(shrinkToFit(shortStr, 2)).toEqual(shortStr);
  });

  it('should return a string of the required length', () => {
    expect(shrinkToFit(longStr, 10)).toHaveLength(10);
  });

  it('should manage odd and even chunk sizes', () => {
    expect(shrinkToFit(longStr, 9)).toHaveLength(9);
    expect(shrinkToFit(longStr, 12)).toHaveLength(12);
  });
});

describe('stringToArray', () => {
  it('should properly parse a comma separated string', () => {
    expect(stringToArray('one, 2, 3,4')).toEqual(['one', '2', '3', '4']);
    expect(stringToArray('1')).toEqual(['1']);
    expect(stringToArray('')).toEqual([]);
  });
});
