import { configFlag, configEquals, configNotEquals } from '../config';

jest.mock('../../../config', () => ({
  deep: {
    truthyFlag: true,
    someValue: 'abc'
  },
  falseyFlag: false,
  truthyFlag: true
}));

describe('Condition: configFlag', () => {

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

});

describe('Condition: configEquals', () => {

  it('should return a function', () => {
    expect(configEquals('deep.someValue', 'abc')).toEqual(expect.any(Function));
  });

  it('should return a function that returns true when path matches given value', () => {
    const condition = configEquals('deep.someValue', 'abc');
    expect(condition()).toEqual(true);
  });

  it('should return a function that returns false when path doesn\'t match given value', () => {
    const condition = configEquals('deep.someValue', 'xyz');
    expect(condition()).toEqual(false);
  });

  it('should return a function that returns false when path doesn\'t exist', () => {
    const condition = configEquals('some.nonexistent.path', 'abc');
    expect(condition()).toEqual(false);
  });

});

describe('Condition: configNotEquals', () => {

  it('should return a function', () => {
    expect(configNotEquals('deep.someValue', 'abc')).toEqual(expect.any(Function));
  });

  it('should return a function that returns false when path matches given value', () => {
    const condition = configNotEquals('deep.someValue', 'abc');
    expect(condition()).toEqual(false);
  });

  it('should return a function that returns true when path doesn\'t match given value', () => {
    const condition = configNotEquals('deep.someValue', 'xyz');
    expect(condition()).toEqual(true);
  });

  it('should return a function that returns true when path doesn\'t exist', () => {
    const condition = configNotEquals('some.nonexistent.path', 'abc');
    expect(condition()).toEqual(true);
  });

});

