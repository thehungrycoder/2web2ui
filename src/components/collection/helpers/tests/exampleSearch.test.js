import {
  isValidExampleValue,
  createExampleSearches,
  getRandomExampleSearch,
  GENERIC_EXAMPLES
} from '../exampleSearch';
import cases from 'jest-in-case';

describe('Collection Component Helpers: Example Searches', () => {

  let rows;
  let keyMap;

  beforeEach(() => {
    rows = [
      { a: 'test', b: true, c: {}, d: null, e: '' },
      { a: 'another string', b: null, c: { nested: 'who cares' }, d: 'second', e: 49 }
    ];
    keyMap = {
      phrase: 'a'
    };
  });

  describe('isValidExampleValue', () => {

    cases('invalid values', (row) => expect(isValidExampleValue(row, 'value')).toEqual(false), {
      'undefined': {},
      'null': { value: null },
      'empty string': { value: '' },
      'object': { value: {}},
      'array': { value: []}
    });

    cases('valid values', (row) => expect(isValidExampleValue(row, 'value')).toEqual(true), {
      'boolean false': { value: false },
      'boolean true': { value: true },
      'zero': { value: 0 },
      'string': { value: 'whatever ok' },
      'number': { value: 415.41 }
    });

  });

  describe('createExampleSearches', () => {

    it('should return the first value when valid', () => {
      const exampleModifiers = ['a', 'b'];
      expect(createExampleSearches(rows, { exampleModifiers })).toEqual(['a:test', 'b:true']);
    });

    it('should return first valid value it can find, even if not in first item', () => {
      const exampleModifiers = ['d', 'e'];
      expect(createExampleSearches(rows, { exampleModifiers })).toEqual(['d:second', 'e:49']);
    });

    it('should wrap the value in quotes if it contains spaces', () => {
      const exampleModifiers = ['a'];
      rows[0].a = 'test with spaces';
      expect(createExampleSearches(rows, { exampleModifiers })).toEqual(['a:"test with spaces"']);
    });

    it('should skip keys that have no valid values', () => {
      const exampleModifiers = ['a', 'c'];
      expect(createExampleSearches(rows, { exampleModifiers })).toEqual(['a:test']);
    });

    it('should use generic defaults if none of the keys produce valid results', () => {
      let exampleModifiers = ['c'];
      expect(createExampleSearches(rows, { exampleModifiers })).toEqual(GENERIC_EXAMPLES);

      exampleModifiers = ['zing'];
      expect(createExampleSearches(rows, { exampleModifiers })).toEqual(GENERIC_EXAMPLES);
    });

    it('should truncate a value that is too long', () => {
      const exampleModifiers = ['a'];
      rows[0].a = 'abcdefghij';
      expect(createExampleSearches(rows, { exampleModifiers, MAX_LENGTH: 5 })).toEqual(['a:abcde']);
    });

    it('should trim trailing white space after truncating', () => {
      const exampleModifiers = ['a'];
      rows[0].a = 'abcd efghij';
      expect(createExampleSearches(rows, { exampleModifiers, MAX_LENGTH: 5 })).toEqual(['a:abcd']);
    });

    it('should map keys so they show up correctly', () => {
      const exampleModifiers = ['phrase'];
      expect(createExampleSearches(rows, { exampleModifiers, keyMap })).toEqual(['phrase:test']);
    });

  });

  describe('getRandomExampleSearch', () => {

    it('should return a randomly selected element from the returned searches', () => {
      const exampleModifiers = ['a', 'b', 'c', 'd', 'e'];
      const result = getRandomExampleSearch({ rows, exampleModifiers });
      expect(['a:test', 'b:true', 'd:second', 'e:49']).toContain(result);
    });

  });

});
