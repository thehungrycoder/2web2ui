import configFlag from '../configFlag';

jest.mock('../../../config', () => ({
  deep: {
    truthyFlag: true
  },
  falseyFlag: false,
  truthyFlag: true
}));

it('should return a function', () => {
  expect(configFlag('something')).toEqual(expect.any(Function));
});

it('should return a function that returns true when config value is true', () => {
  const condition = configFlag('truthyFlag');
  expect(condition()).toEqual(true);
});

it('should return a function that returns false when config value is false', () => {
  const condition = configFlag('falseyFlag');
  expect(condition()).toEqual(false);
});

it('should return a function that returns false when config key is not present', () => {
  const condition = configFlag('unkownFlag');
  expect(condition()).toEqual(false);
});

it('should return a function that returns true when a nested key is true', () => {
  const condition = configFlag('deep.truthyFlag');
  expect(condition()).toEqual(true);
});
