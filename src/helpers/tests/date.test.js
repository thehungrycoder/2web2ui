import * as dateHelpers from '../date';
import cases from 'jest-in-case';

describe('Date helpers', () => {
  it('should get end of day', () => {
    expect(dateHelpers.getEndOfDay('2017-12-18T10:00')).toEqual(new Date('2017-12-19T04:59:59.000Z'));

  });

  it('should get start of day', () => {
    expect(dateHelpers.getStartOfDay('2017-12-18T10:00')).toEqual(new Date('2017-12-18T05:00:00.000Z'));

  });

  const date = new Date('2017-12-18');
  Date.now = jest.fn(() => date);
  cases('getRelativeDates calculations', ({ range }) => {
    expect(dateHelpers.getRelativeDates(range)).toMatchSnapshot();
  }, {
    'for an hour ago': { range: 'hour' },
    'for a day ago': { range: 'day' },
    'for a week ago': { range: '7days' },
    'for a month': { range: '30days' },
    'for a quarter ago': { range: '90days' },
    'for an invalid range': { range: 'invalid-range' }
  });

  describe('formatDateTime', () => {
    it('formats date and time correctly', () => {
      expect(dateHelpers.formatDateTime(new Date('2018-1-15').toISOString())).toMatchSnapshot();
    });
  });
});


