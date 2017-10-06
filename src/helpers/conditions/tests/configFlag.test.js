import configFlag from '../configFlag';

it('should return a function', () => {
  expect(configFlag('something')).toEqual(expect.any(Function));
});

it('should return a function that returns true when config value is true', () => {
  const condition = configFlag('testFlag');
  const config = { testFlag: true };
  expect(condition({ config })).toEqual(true);
});

it('should return a function that returns false when config value is false', () => {
  const condition = configFlag('testFlag');
  const config = { testFlag: false };
  expect(condition({ config })).toEqual(false);
});

it('should return a function that returns false when config key is not present', () => {
  const condition = configFlag('testFlag');
  const config = {};
  expect(condition({ config })).toEqual(false);
});

it('should return a function that returns true when a nested key is true', () => {
  const condition = configFlag('some.nested.flag');
  const config = { some: { nested: { flag: true }}};
  expect(condition({ config })).toEqual(true);
});
