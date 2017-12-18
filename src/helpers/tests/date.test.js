import moment from 'moment';
import * as dateHelpers from '../date';

describe('Date helpers', () => {
  it('should get end of day', () => {
    expect(dateHelpers.getEndOfDay('2017-12-18T10:00')).toEqual(new Date('2017-12-19T04:59:59.000Z'));

  });

  it('should get start of day', () => {
    expect(dateHelpers.getStartOfDay('2017-12-18T10:00')).toEqual(new Date('2017-12-18T05:00:00.000Z'));

  });

  it('should get relative dates', () => {
    const date = new Date('2017-12-18');
    Date.now = jest.fn(() => date);
    expect(dateHelpers.getRelativeDates('hour')).toMatchSnapshot();
    expect(dateHelpers.getRelativeDates('day')).toMatchSnapshot();
    expect(dateHelpers.getRelativeDates('7days')).toMatchSnapshot();
    expect(dateHelpers.getRelativeDates('30days')).toMatchSnapshot();
    expect(dateHelpers.getRelativeDates('90days')).toMatchSnapshot();
    expect(dateHelpers.getRelativeDates('invalid-range')).toMatchSnapshot();
  });

});


