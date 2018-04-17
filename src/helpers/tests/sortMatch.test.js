import sortMatch, { objectSortMatch, getObjectPattern } from '../sortMatch';
import _ from 'lodash';
import * as scorers from '../sortMatchScorers';

describe('Helper: sortMatch', () => {

  beforeEach(() => {
    scorers.basicScorer = jest.fn();
    scorers.objectScorer = jest.fn();
    scorers.basicScorer.mockReturnValue(0);
    scorers.objectScorer.mockReturnValue(0);
  });

  it('should filter and sort by basic score', () => {
    scorers.basicScorer
      .mockReturnValueOnce(5)
      .mockReturnValueOnce(8);

    const result = sortMatch(['a', 'b', 'c', 'd', 'e'], 'test pattern');
    expect(scorers.basicScorer).toHaveBeenCalledTimes(5);
    expect(result).toEqual(['b', 'a']);
  });

  it('should call a custom getter for every item', () => {
    const getter = jest.fn(() => 'a');
    sortMatch([1, 2, 3, 4, 5], 'test-pattern', getter);
    expect(getter).toHaveBeenCalledTimes(5);
  });

  describe('objectSortMatch', () => {

    beforeEach(() => {
      scorers.objectScorer
        .mockReturnValueOnce(5)
        .mockReturnValueOnce(8);

      scorers.basicScorer
        .mockReturnValueOnce(5)
        .mockReturnValueOnce(8);
    });

    it('should filter and sort results', () => {
      const result = objectSortMatch({
        items: [{ a: 1 }, { a: 2 }, { a: 3 }],
        pattern: 'key:value whatever',
        getter: (item) => item.a
      });
      expect(result).toEqual([{ a: 2 }, { a: 1 }]);
    });

    it('should filter and sort results using primary sorter function', () => {
      const primarySorter = jest.fn((items) => _.reverse(items));
      const result = objectSortMatch({
        items: [{ a: 1 }, { a: 2 }, { a: 3 }],
        pattern: 'key:value whatever',
        getter: (item) => item.a,
        primarySorter
      });
      expect(primarySorter).toHaveBeenCalled();
      expect(result).toEqual([{ a: 1 }, { a: 2 }]);
    });

    it('should only run the object scorer when only modifiers are present', () => {
      objectSortMatch({
        items: [{ a: 1 }, { a: 2 }, { a: 3 }],
        pattern: 'key:value',
        getter: (item) => item.a
      });
      expect(scorers.basicScorer).toHaveBeenCalledTimes(0);
      expect(scorers.objectScorer).toHaveBeenCalledTimes(3);
    });

    it('should only run the basic scorer when no modifiers are present', () => {
      objectSortMatch({
        items: [{ a: 1 }, { a: 2 }, { a: 3 }],
        pattern: 'value',
        getter: (item) => item.a
      });
      expect(scorers.basicScorer).toHaveBeenCalledTimes(3);
      expect(scorers.objectScorer).toHaveBeenCalledTimes(0);
    });

    it('should add basic and object scorer results together for final sort', () => {
      scorers.basicScorer.mockReset();
      scorers.basicScorer
        .mockReturnValueOnce(3)
        .mockReturnValueOnce(4)
        .mockReturnValueOnce(0);

      scorers.objectScorer.mockReset();
      scorers.objectScorer
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(7)
        .mockReturnValueOnce(10);

      const result = objectSortMatch({
        items: [{ a: 1 }, { a: 2 }, { a: 3 }],
        pattern: 'key:value other stuff',
        getter: (item) => item.a
      });

      expect(scorers.basicScorer).toHaveBeenCalledTimes(3);
      expect(scorers.objectScorer).toHaveBeenCalledTimes(3);
      expect(result).toEqual([{ a: 2 }, { a: 3 }, { a: 1 }]);
    });

  });

  describe('getObjectPattern', () => {

    it('should convert key:value pairs', () => {
      expect(getObjectPattern('whatever key:value name:bob')).toEqual({ key: 'value', name: 'bob' });
    });

    it('should convert exact matches wrapped in quotes', () => {
      expect(getObjectPattern('whatever key:"some value with spaces" other:"cool"'))
        .toEqual({ key: 'some value with spaces', other: 'cool' });
    });

    it('should return an empty object if no key:value pattern is found', () => {
      expect(getObjectPattern('no pairs here')).toEqual({});
    });

    it('should return the memoized cached version if the pattern stays the same', () => {
      const first = getObjectPattern('k:v');
      const second = getObjectPattern('k:v');
      expect(first).toBe(second);
    });

  });

});
