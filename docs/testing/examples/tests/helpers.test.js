import { sumKeys, formatObject } from '../helpers';
import * as mocks from '../_example-mocks';

jest.mock('../_example-mocks');

describe('Helper tests', () => {

  describe('sumKeys', () => {

    let list;

    beforeEach(() => {
      list = [
        { a: 1, b: 2 },
        { a: 5, b: 1 },
        { a: 3, b: 3, c: 0 },
        { a: 1, b: 9, c: 4 }
      ];
    });

    it('should sum up values from a list of objects, by key', () => {
      const sum = sumKeys({ list, key: 'a' });
      expect(sum).toEqual(10);
    });

    it('should treat an item without the key as 0', () => {
      const sum = sumKeys({ list, key: 'c' });
      expect(sum).toEqual(4);
    });

    it('should treat non-numbers as 0', () => {
      list[0].a = 'banana';
      const sum = sumKeys({ list, key: 'a' });
      expect(sum).toEqual(9);
    });

  });

  describe('format object', () => {

    beforeEach(() => {
      mocks.formatColor = jest.fn(() => 'formatted');
    });

    it('should format a simple object', () => {
      const simple = {
        id: 'abc',
        fname: 'Jessie',
        lname: 'Soho',
        color: 'DodgerBlue'
      };
      expect(formatObject(simple)).toEqual({
        id: 'ABC',
        name: 'Jessie Soho',
        color: 'formatted'
      });
    });

  });
});
