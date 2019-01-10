import {
  snakeToFriendly, snakeToCamel, slugify, slugToFriendly, shrinkToFit, stringToArray,
  stringifyTypeaheadfilter, stripTags, decodeBase64, tagAsCopy, trimWhitespaces, pluralString
} from '../string';

describe('snakeToFrindly', () => {
  it('should properly format a snaked cased string', () => {
    expect(snakeToFriendly('a_cool_string')).toEqual('A Cool String');
  });

  it('should handle undefined', () => {
    expect(snakeToFriendly(undefined)).toEqual('');
  });
});

describe('snakeToCamel', () => {
  it('should properly format a snaked cased string', () => {
    expect(snakeToCamel('a_cool_string')).toEqual('aCoolString');
  });
});

describe('slugify', () => {
  it('should split camelCase humps with a hypen', () => {
    expect(slugify('exampleValue')).toEqual('example-value');
  });

  it('should replace underscores with a hypen', () => {
    expect(slugify('example_value')).toEqual('example-value');
  });

  it('should replace whitespace with a hypen', () => {
    expect(slugify('white       space')).toEqual('white-space');
  });

  it('should lowercase', () => {
    expect(slugify('UPPERCASE')).toEqual('uppercase');
  });

  it('should remove invalid characters', () => {
    expect(slugify('Example #1')).toEqual('example-1');
  });
});

describe('slugToFriendly', () => {
  it('should uppercase first character', () => {
    expect(slugToFriendly('e')).toEqual('E');
  });

  it('should replace a hyphen and uppercase first letter', () => {
    expect(slugToFriendly('example-slug')).toEqual('Example Slug');
  });

  it('should replace all hyphen and uppercase first letter', () => {
    expect(slugToFriendly('my-example-slug')).toEqual('My Example Slug');
  });

  it('should replace hyphen and underscore group and uppercase first letter', () => {
    expect(slugToFriendly('example___---slug')).toEqual('Example Slug');
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

describe('stringifyTypeaheadfilter', () => {
  it('stringifies subaccount type correctly', () => {
    expect(stringifyTypeaheadfilter({ type: 'Subaccount', value: 'test-value', id: 110 }))
      .toEqual('Subaccount:test-value:110');

    expect(stringifyTypeaheadfilter({ type: 'otherfilter', value: 'otherfiltervalue', id: 220 }))
      .toEqual('otherfilter:otherfiltervalue');
  });
});

describe('stripTags', () => {
  it('should remove leading and trailing tags', () => {
    expect(stripTags('<p>This is a test.</p>')).toEqual('This is a test.');
  });

  it('should remove single tags', () => {
    expect(stripTags('This is</br>a test.')).toEqual('This isa test.'); // ugh
  });

  it('should replace multiple spaces with a space', () => {
    expect(stripTags('This       is a test.')).toEqual('This is a test.');
  });

  it('should replace newline strings with a space', () => {
    expect(stripTags('This is\\r\\na test.')).toEqual('This is a test.');
  });
});

describe('decodeBase64', () => {
  it('should ignores errors and returns undefined', () => {
    expect(decodeBase64()).toBeUndefined();
  });

  it('should decode and return string', () => {
    const encoded = btoa('Testing!');
    expect(decodeBase64(encoded)).toEqual('Testing!');
  });
});

describe('trimWhitespaces', () => {
  it('trims leading/trailing whitespaces in string only', () => {
    expect(trimWhitespaces(' hello ')).toEqual('hello');
    expect(trimWhitespaces('hello')).toEqual('hello');
    expect(trimWhitespaces('hello there')).toEqual('hello there');
    expect(trimWhitespaces(undefined)).toEqual('');
  });
});

describe('tagAsCopy', () => {
  it('should append copy tag', () => {
    expect(tagAsCopy('Example')).toEqual('Example Copy');
  });

  it('should append count to tag', () => {
    expect(tagAsCopy('Example Copy')).toEqual('Example Copy 2');
  });

  it('should increment count', () => {
    expect(tagAsCopy('Example Copy 2')).toEqual('Example Copy 3');
  });
});

describe('pluralString', () => {
  it('should return string for single amount', () => {
    expect(pluralString(1, 'thing', 'things')).toEqual('1 thing');
  });

  it('should return string for plural amount', () => {
    expect(pluralString(2, 'thing', 'things')).toEqual('2 thing');
  });
});
