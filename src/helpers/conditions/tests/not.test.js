import not from '../not';

describe('Condition Helper: not', () => {

  it('should return a function that reverses a condition', () => {
    const isLetter = (letter) => (options) => letter === options.letter;

    expect(isLetter('a')({ letter: 'a' })).toEqual(true);
    expect(isLetter('a')({ letter: 'b' })).toEqual(false);

    expect(not(isLetter('a'))({ letter: 'a' })).toEqual(false);
    expect(not(isLetter('a'))({ letter: 'b' })).toEqual(true);
  });

});
