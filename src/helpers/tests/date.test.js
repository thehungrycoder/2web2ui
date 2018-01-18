import { getEndOfDay, getStartOfDay, getRelativeDates } from '../date';
import cases from 'jest-in-case';
import moment from 'moment';

describe('Date helpers', () => {

  afterEach(() => jest.restoreAllMocks());

  it('should get end of day', () => {
    const endOfDay = new Date('2017-12-18T23:59:59.999');
    expect(getEndOfDay('2017-12-18T00:00:00')).toEqual(endOfDay);
    expect(getEndOfDay('2017-12-18T23:00:00')).toEqual(endOfDay);
  });

  it('(with preventFuture: true) should get end of day as current time if end of day is in the future', () => {
    const now = new Date('2017-12-18T04:20:00');
    Date.now = jest.fn(() => now);
    expect(getEndOfDay('2017-12-18', { preventFuture: true })).toEqual(now);
  });

  it('(with preventFuture: true) should get end of day normally if end of day is in the past', () => {
    const now = new Date('2017-12-18T04:20:00');
    const endOfDay = new Date('2017-11-01T23:59:59.999');
    Date.now = jest.fn(() => now);
    expect(getEndOfDay('2017-11-01T12:00:00', { preventFuture: true })).toEqual(endOfDay);
  });

  it('should get start of day', () => {
    const startOfDay = new Date('2017-12-18T00:00:00.000');
    expect(getStartOfDay('2017-12-18T00:01:59')).toEqual(startOfDay);
    expect(getStartOfDay('2017-12-18T23:59:59')).toEqual(startOfDay);
  });

  cases('getRelativeDates calculations', ({ range, subtractArgs }) => {
    const date = moment('2017-12-18').utc().toDate();
    Date.now = jest.fn(() => date);
    const { from, to } = getRelativeDates(range);
    expect(to).toEqual(date);
    expect(from).toEqual(moment(date).subtract(...subtractArgs).toDate());
  }, {
    'for an hour ago': { range: 'hour', subtractArgs: [1, 'hours']},
    'for a day ago': { range: 'day', subtractArgs: [1, 'days']},
    'for a week ago': { range: '7days', subtractArgs: [7, 'days']},
    'for a month': { range: '30days', subtractArgs: [30, 'days']},
    'for a quarter ago': { range: '90days', subtractArgs: [90, 'days']}
  });

  it('should return an empty object when getting a relative range for an invalid range type', () => {
    expect(getRelativeDates('invalid-like-whoa')).toEqual({});
  });

  describe('formatDateTime', () => {
    it('formats date and time correctly', () => {
      expect(dateHelpers.formatDateTime(new Date('2018-1-15').toISOString())).toMatchSnapshot();
    });
  });
});


