import isDefaultPool from '../defaultPool';

describe('isDefaultPool helper tests', () => {
  it('should return true if poolId is default', () => {
    expect(isDefaultPool('default')).toEqual(true);
  });

  it('should return false if poolId is not default', () => {
    expect(isDefaultPool('not-default')).toEqual(false);
  });
});
