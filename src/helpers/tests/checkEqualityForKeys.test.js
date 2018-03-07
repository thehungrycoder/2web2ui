import checkEqualityForKeys from '../checkEqualityForKeys';

describe('Helper: checkEqualityForKeys', () => {

  it('should return true if all key-values are equal across a and b objects', () => {
    const a = {
      one: 1,
      two: 2
    };
    const b = {
      one: 1,
      three: 3,
      two: 2
    };

    expect(checkEqualityForKeys({ a, b, keys: ['one', 'two']})).toEqual(true);
  });

  it('should return true if values are deeply equal across a and b objects', () => {
    const a = {
      one: {
        eleven: 11
      },
      two: [2, 22, 222]
    };
    const b = {
      one: {
        eleven: 11
      },
      two: [2, 22, 222]
    };

    expect(checkEqualityForKeys({ a, b, keys: ['one', 'two']})).toEqual(true);
  });

  it('should return true if values are both undefined', () => {
    const a = {};
    const b = {};
    expect(checkEqualityForKeys({ a, b, keys: ['oops']})).toEqual(true);
  });

  it('should return false if there is a single difference', () => {
    const a = {
      one: 1,
      two: 2
    };
    const b = {
      one: 1,
      two: 22
    };
    expect(checkEqualityForKeys({ a, b, keys: ['one', 'two']})).toEqual(false);
  });

  it('should return false if values are deeply UN-equal across a and b objects', () => {
    const a = {
      one: {
        eleven: 11
      },
      two: [2, 22]
    };
    const b = {
      one: {
        eleven: 11
      },
      two: [2, 22, 222]
    };

    expect(checkEqualityForKeys({ a, b, keys: ['one', 'two']})).toEqual(false);
  });

});
