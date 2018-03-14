import { basicScorer, objectScorer } from '../sortMatchScorers';

describe('Helper: sortMatchScorers', () => {

  describe('basic scorer', () => {

    const caseSensitiveExact = basicScorer('Hello World', 'Hello World');
    const caseInsensitiveExact = basicScorer('Hello World', 'hElLO WoRLd');
    const caseSensitiveStartsWith = basicScorer('Hello World', 'Hell');
    const caseInsensitiveStartsWith = basicScorer('Hello World', 'hell');

    const wordBoundary = basicScorer('Hello World', 'world');
    const dashBoundary = basicScorer('Hello-World', 'world');
    const underscoreBoundary = basicScorer('Hello_World', 'world');

    const containsThreeChars = basicScorer('Hello World', 'ell');

    it('should return 0 if the needle is longer', () => {
      expect(basicScorer('Hello World', 'Hello World what is up')).toEqual(0);
    });

    it('should return 0 if the needle is not present at all', () => {
      expect(basicScorer('Hello World', 'Cool')).toEqual(0);
    });

    it('should score a case-sensitive exact match higher than case-insensitive', () => {
      expect(caseSensitiveExact).toBeGreaterThan(caseInsensitiveExact);
      expect(caseInsensitiveExact).toBeGreaterThan(0);
    });

    it('should score a case insensitive exact match higher than a case sensitive starts-with match', () => {
      expect(caseInsensitiveExact).toBeGreaterThan(caseSensitiveStartsWith);
      expect(caseSensitiveStartsWith).toBeGreaterThan(0);
    });

    it('should score a case sensitive starts-with match higher than a case insensitive starts-with match', () => {
      expect(caseSensitiveStartsWith).toBeGreaterThan(caseInsensitiveStartsWith);
      expect(caseInsensitiveStartsWith).toBeGreaterThan(0);
    });

    it('should score a case insensitive starts-with match higher than a word boundary match', () => {
      expect(caseInsensitiveStartsWith).toBeGreaterThan(wordBoundary);
      expect(wordBoundary).toBeGreaterThan(0);
    });

    it('should score a word boundary match higher than a dash or underscore boundary match', () => {
      expect(wordBoundary).toBeGreaterThan(dashBoundary);
      expect(wordBoundary).toBeGreaterThan(underscoreBoundary);
      expect(dashBoundary).toEqual(underscoreBoundary);
      expect(dashBoundary).toBeGreaterThan(0);
      expect(underscoreBoundary).toBeGreaterThan(0);
    });

    it('should score dash and underscore boundary matches higher than contains matches', () => {
      expect(dashBoundary).toBeGreaterThan(containsThreeChars);
      expect(underscoreBoundary).toBeGreaterThan(containsThreeChars);
      expect(containsThreeChars).toBeGreaterThan(0);
    });

    it('should return 0 if the needle segment is too small for the length of the haystack', () => {
      expect(basicScorer('Hello World', 'el')).toEqual(0);
      expect(basicScorer('Hello Wo', 'el')).toBeGreaterThan(0);
      expect(basicScorer('Hello Wo', 'e')).toEqual(0);
      expect(basicScorer('Hell', 'e')).toBeGreaterThan(0);
    });
  });

  describe('object scorer', () => {

    let mockScorer;

    beforeEach(() => {
      mockScorer = jest.fn(() => 100);
    });

    it('should return 0 if the object pattern is empty', () => {
      expect(objectScorer({
        item: { name: 'Janet Jones' },
        objectPattern: {},
        scorer: mockScorer
      })).toEqual(0);
    });

    it('should return correct score if a single matching key returns a scoring value', () => {
      expect(objectScorer({
        item: {
          name: 'Janet Jones',
          age: 29
        },
        objectPattern: {
          name: 'matches'
        },
        scorer: mockScorer
      })).toEqual(100);
      expect(mockScorer).toHaveBeenCalledTimes(1);
    });

    it('should accumulate scores when multiple matching keys have scoring values', () => {
      expect(objectScorer({
        item: {
          name: 'Janet Jones',
          age: 29,
          address: '123 Fake St'
        },
        objectPattern: {
          name: 'matches',
          age: 29,
          whatever: 'nope'
        },
        scorer: mockScorer
      })).toEqual(200);
      expect(mockScorer).toHaveBeenCalledTimes(2);
    });

    it('should return 0 if no matching keys have scoring values', () => {
      mockScorer = jest.fn(() => 0);
      expect(objectScorer({
        item: {
          name: 'Janet Jones',
          age: 29,
          address: '123 Fake St'
        },
        objectPattern: {
          name: 'no match',
          age: 44,
          whatever: 'nope'
        },
        scorer: mockScorer
      })).toEqual(0);
      expect(mockScorer).toHaveBeenCalledTimes(2);
    });

    it('should return the correct score when some matching keys have scoring values', () => {
      mockScorer = jest.fn(() => 0);
      mockScorer.mockReturnValueOnce(100);
      expect(objectScorer({
        item: {
          name: 'Janet Jones',
          age: 29,
          address: '123 Fake St'
        },
        objectPattern: {
          name: 'matches',
          age: 44,
          whatever: 'nope'
        },
        scorer: mockScorer
      })).toEqual(100);
      expect(mockScorer).toHaveBeenCalledTimes(2);
    });

    it('should map object pattern keys before comparing against the item keys', () => {
      objectScorer({
        item: { a: 1, b: 2, c: 3 },
        objectPattern: { x: 1, y: 2, z: 3 },
        keyMap: { x: 'a', y: 'b', z: 'c' },
        scorer: mockScorer
      });
      expect(mockScorer).toHaveBeenCalledTimes(3);
    });

    it('should allow matching when bypassing mapped keys', () => {
      objectScorer({
        item: {
          label: 'whatev'
        },
        objectPattern: {
          label: 'whatev'
        },
        keyMap: {
          name: 'label'
        },
        scorer: mockScorer
      });
      expect(mockScorer).toHaveBeenCalledTimes(1);
    });

    it('should apply the default key map', () => {
      objectScorer({
        item: { subaccount_id: 123 },
        objectPattern: { subaccount: 123 },
        scorer: mockScorer
      });
      expect(mockScorer).toHaveBeenCalledTimes(1);
    });

  });

});
