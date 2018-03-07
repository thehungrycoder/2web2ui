import convertListToBoolHash from '../convertListToBoolHash';

describe('Helper: convertListToBoolHash', () => {

  it('should convert a list of strings into a hash where the strings are keys and each value is true', () => {
    const list = ['one', 'three', 'four', 'seven'];
    expect(convertListToBoolHash(list)).toEqual({
      one: true,
      three: true,
      four: true,
      seven: true
    });
  });

});
