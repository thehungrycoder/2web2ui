import * as mathHelpers from '../math';

describe('math helpers', () => {
  it('should calculate rate', () => {
    expect(mathHelpers.safeRate(5, 10)).toEqual(50);
  });

  it('should default infinite average values to 0', () => {
    expect(mathHelpers.safeDivide(5, 0)).toEqual(0);
  });
});
