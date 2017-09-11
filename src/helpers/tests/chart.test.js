import {
  getDayLines,
  getTimeTickFormatter,
  getTooltipLabelFormatter,
  getLineChartFormatters
} from '../chart';
import { getPrecisionType as mockGetPrecisionType } from '../metrics';

jest.mock('../metrics');

function getDate(hours, date = '2017-06-15T12:00') {
  const d = new Date(date);
  d.setHours(hours);
  return d;
}

function getTimestampWithFixedHour(date, hour) {
  const d = getDate(hour, date);
  return d.getTime();
}

describe('Helper: chart', () => {

  describe('getDayLines', () => {
    it('should return an empty array if precision type is not "hours"', () => {
      mockGetPrecisionType.returns('not-hours');
      const lines = getDayLines([]);
      expect(lines.length).toEqual(0);
    });

    it('should return an item for every 0-hour date', () => {
      mockGetPrecisionType.returns('hours');
      const data = [
        { ts: getTimestampWithFixedHour('2017-01-01T12:00', 12) },
        { ts: getTimestampWithFixedHour('2017-01-02T00:00', 0) },
        { ts: getTimestampWithFixedHour('2017-01-02T12:00', 12) },
        { ts: getTimestampWithFixedHour('2017-01-03T00:00', 0) },
        { ts: getTimestampWithFixedHour('2017-01-03T00:15', 0) },
        { ts: getTimestampWithFixedHour('2017-01-03T12:00', 12) }
      ];
      const lines = getDayLines(data);
      expect(lines.length).toEqual(3);
    });

    it('should ignore 0-hour dates in the first and last position', () => {
      mockGetPrecisionType.returns('hours');
      const data = [
        { ts: getTimestampWithFixedHour('2017-01-01T12:00', 0) },
        { ts: getTimestampWithFixedHour('2017-01-02T00:00', 0) },
        { ts: getTimestampWithFixedHour('2017-01-02T12:00', 12) },
        { ts: getTimestampWithFixedHour('2017-01-03T00:00', 12) },
        { ts: getTimestampWithFixedHour('2017-01-03T00:15', 0) },
        { ts: getTimestampWithFixedHour('2017-01-03T12:00', 0) }
      ];
      const lines = getDayLines(data);
      expect(lines.length).toEqual(2);
    })
  });

  describe('getTimeTickFormatter', () => {

    it('should format an "hourly" tick', () => {
      const format = getTimeTickFormatter('hours');
      const formatted = format(getDate(12));
      expect(formatted).toEqual('12:00pm');
    });

    it('should format a "non-hourly" tick', () => {
      const format = getTimeTickFormatter('days');
      const formatted = format(getDate(12));
      expect(formatted).toEqual('Jun 15th');
    });

    it('should return the same function for the same precision (memoized)', () => {
      const a = getTimeTickFormatter('hours');
      const b = getTimeTickFormatter('hours');
      const c = getTimeTickFormatter('days');

      expect(a).toBe(b);
      expect(a).not.toBe(c);
    });
  });

  describe('getTooltipLabelFormatter', () => {
    it('should format an "hourly" label', () => {
      const format = getTooltipLabelFormatter('hours');
      const formatted = format(getDate(16));
      expect(formatted).toEqual('Jun 15th at 4:00 PM');
    });

    it('should format a "non-hourly" label', () => {
      const format = getTooltipLabelFormatter('days');
      const formatted = format(getDate(16));
      expect(formatted).toEqual('June 15th');
    });

    it('should memoize', () => {
      const a = getTooltipLabelFormatter('hours');
      const b = getTooltipLabelFormatter('hours');
      const c = getTooltipLabelFormatter('days');

      expect(a).toBe(b);
      expect(a).not.toBe(c);
    });
  });

  describe('getLineChartFormatters', () => {
    mockGetPrecisionType.returns('hours');
    const formatters = getLineChartFormatters();
    expect(Object.keys(formatters).length).toEqual(2);
    expect(formatters.xTickFormatter).toEqual(expect.any(Function));
    expect(formatters.tooltipLabelFormatter).toEqual(expect.any(Function));
  });

});