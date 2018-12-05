import * as metricsHelpers from '../metrics';
import moment from 'moment';
import * as dateHelpers from 'src/helpers/date';
import cases from 'jest-in-case';
import _ from 'lodash';

jest.mock('src/helpers/date');

describe('metrics helpers', () => {

  beforeEach(() => {
    dateHelpers.getLocalTimezone = jest.fn(() => 'Mock/Timezone');
  });

  it('should build return correct options from updates', () => {
    const actual = metricsHelpers.getQueryFromOptions({
      from: '2017-12-18T00:00Z',
      to: '2017-12-18T11:00Z',
      metrics: [
        { key: 'count_bounce' },
        { key: 'foo_bar', computeKeys: 'test + last' }
      ],
      filters: [
        { value: 'gmail.com', type: 'Recipient Domain' },
        { value: 'foobar', type: 'Subaccount', id: 100 }
      ]
    });

    expect(actual).toMatchSnapshot();
  });

  it('should return options with limit key if given limit as a parameter', () => {
    const actual = metricsHelpers.getQueryFromOptions({
      from: '2017-12-18T00:00Z',
      to: '2017-12-18T11:00Z',
      metrics: [
        { key: 'count_bounce' }
      ],
      filters: [],
      limit: 1000
    });

    expect(actual).toMatchObject({ limit: 1000 });
  });

  it('should return options with match key if given match as a parameter', () => {
    const actual = metricsHelpers.getQueryFromOptions({
      from: '2017-12-18T00:00Z',
      to: '2017-12-18T11:00Z',
      metrics: [
        { key: 'count_bounce' }
      ],
      filters: [],
      match: 'foo'
    });

    expect(actual).toMatchObject({ match: 'foo' });
  });

  it('should pushToKey', () => {
    const actual = metricsHelpers.pushToKey({ foo: 'bar', baz: 'bot' }, 'test', 'value');
    expect(actual).toMatchSnapshot();
  });

  it('should set appropriate delimiter', () => {
    const actual = metricsHelpers.getDelimiter([
      { value: 'test,me' },
      { value: 'foo;bar' },
      { value: 'test:me' }
    ]);

    expect(actual).toEqual('+');
  });

  it('should getPrecision from dates', () => {
    const from = moment('2016-12-18T00:00').utc();
    const to = moment('2016-12-18T00:30').utc();

    expect(metricsHelpers.getPrecision(from, to)).toEqual('1min');

    to.add(1, 'hours');
    expect(metricsHelpers.getPrecision(from, to)).toEqual('5min');

    to.add(2, 'hours');
    expect(metricsHelpers.getPrecision(from, to)).toEqual('15min');

    to.add(5, 'hours');
    expect(metricsHelpers.getPrecision(from, to)).toEqual('hour');

    to.add(6, 'days');
    expect(metricsHelpers.getPrecision(from, to)).toEqual('day'); // 12hr precision makes for an odd x-axis, use day here

    to.add(25, 'days');
    expect(metricsHelpers.getPrecision(from, to)).toEqual('day');

    to.add(30, 'days');
    expect(metricsHelpers.getPrecision(from, to)).toEqual('week');

    to.add(200, 'days');
    expect(metricsHelpers.getPrecision(from, to)).toEqual('month');

  });

  it('should return minutes as moment precision type', () => {
    expect(metricsHelpers.getMomentPrecision('1min')).toEqual('minutes');
  });

  it('should return hours as moment precision type', () => {
    expect(metricsHelpers.getMomentPrecision('day')).toEqual('hours');
  });

  it('should return hours as precision type', () => {
    expect(metricsHelpers.getPrecisionType('1min')).toEqual('hours');
  });

  it('should return days as precision type', () => {
    expect(metricsHelpers.getPrecisionType('day')).toEqual('days');
  });

  describe('roundBoundaries', () => {
    const caseList = [
      {
        timeLabel: '1min',
        from: '2016-12-18T10:28',
        to: '2016-12-18T11:28',
        expected: { from: '2016-12-18T10:28', to: '2016-12-18T11:28' }
      },
      {
        timeLabel: '5min',
        from: '2016-12-18T10:09',
        to: '2016-12-18T12:01',
        expected: { from: '2016-12-18T10:05', to: '2016-12-18T12:05' }
      },
      {
        timeLabel: '15min',
        from: '2016-12-18T06:29',
        to: '2016-12-18T10:01',
        expected: { from: '2016-12-18T06:15', to: '2016-12-18T10:15' }
      },
      {
        timeLabel: 'hour',
        from: '2016-12-16T10:59',
        to: '2016-12-18T10:01',
        expected: { from: '2016-12-16T10:00', to: '2016-12-18T10:59' }
      },
      {
        timeLabel: 'day',
        from: '2016-11-15T10:59',
        to: '2016-12-18T10:01',
        expected: { from: '2016-11-15T10:00', to: '2016-12-18T10:59' }
      },
      {
        timeLabel: 'week',
        from: '2016-06-21T10:59',
        to: '2016-12-18T10:02',
        expected: { from: '2016-06-21T10:00', to: '2016-12-18T10:59' }
      },
      {
        timeLabel: 'month',
        from: '2016-02-18T10:59',
        to: '2016-12-18T10:02',
        expected: { from: '2016-02-18T10:00', to: '2016-12-18T10:59' }
      }
    ];

    const allCases = _.flatMap(caseList, (caseObj) => {
      const cases = [];
      const expectedTo = caseObj.timeLabel === '1min' // we don't round at this precision
        ? moment(caseObj.expected.to)
        : moment(caseObj.expected.to).endOf('minutes');
      cases.push({
        name: `should round at ${caseObj.timeLabel}`,
        from: moment(caseObj.from),
        to: moment(caseObj.to),
        expectedValue: { from: moment(caseObj.expected.from).toISOString(), to: expectedTo.toISOString() }
      });
      cases.push({
        name: `should not round if already at nearest precision for ${caseObj.timeLabel}`,
        from: moment(caseObj.expected.from),
        to: expectedTo,
        expectedValue: { from: moment(caseObj.expected.from).toISOString(), to: expectedTo.toISOString() }
      });

      return cases;
    });

    cases('should round from and to values', ({ timeLabel, from, to, expectedValue }) => {
      const { from: resFrom, to: resTo } = metricsHelpers.roundBoundaries(from, to);

      expect(resFrom.toISOString()).toEqual(expectedValue.from);
      expect(resTo.toISOString()).toEqual(expectedValue.to);
    }, allCases);
  });


  it('should get metrics from keys', () => {
    const actual = metricsHelpers.getMetricsFromKeys(['count_delayed', 'count_injected']);
    expect(actual).toMatchSnapshot();
  });

  it('should compute keys during transform', () => {
    const data = [
      { count_rendered: 100, count_unique_confirmed_opened_approx: 1, count_targeted: 100 },
      { count_rendered: 101 }
    ];

    const metrics = [
      { key: 'count_rendered' },
      { key: 'open_rate_approx', computeKeys: ['count_unique_confirmed_opened_approx', 'count_targeted'], type: 'percentage', compute: (item, keys) => ((item[keys[0]] / item[keys[1]]) * 100) }
    ];

    const actual = metricsHelpers.transformData(data, metrics);
    expect(actual).toMatchSnapshot();
  });

  it('should build common metric options', () => {
    dateHelpers.getRelativeDates = jest.fn(() => ({ from: 'foo', to: 'bar' }));

    const actual = metricsHelpers.buildCommonOptions({ domain: 'gmail' }, { campaign: 'test', relativeRange: '7days' });

    expect(actual).toMatchSnapshot();

  });

  it('should calculate average', () => {
    const item = { total_delivery_time_first: 500000, count_delivered_first: 500 };
    const keys = ['total_delivery_time_first', 'count_delivered_first'];
    expect(metricsHelpers.average(item, keys)).toEqual(1000);
  });

  it('should calculate rate', () => {
    const item = { count_accepted: 27, count_targeted: 30 };
    const keys = ['count_accepted', 'count_targeted'];
    expect(metricsHelpers.rate(item, keys)).toEqual(90);
  });


  describe('getValidDateRange', () => {

    const invalidCases = [
      {
        name: 'with undefined to',
        from: moment('2018-01-15')
      },
      {
        name: 'with undefined from',
        to: moment('2017-12-15')
      },
      {
        name: 'with invalid to',
        to: 'garbage',
        from: moment('2018-01-15')
      },
      {
        name: 'with invalid from',
        to: moment('2017-12-15'),
        from: 'garbage'
      },
      {
        name: 'with invalid now',
        from: moment('2018-01-15'),
        to: moment('2017-12-15'),
        now: 'garbage'
      },
      {
        name: 'when to is before from',
        from: moment('2018-01-15'),
        to: moment('2017-12-15')
      },
      {
        name: 'when to is after now',
        from: moment('2018-01-15'),
        to: moment('2018-02-15'),
        now: moment('2018-02-00')
      },
      {
        name: 'when to is after now (without rounding)',
        from: moment('2018-01-15'),
        to: moment('2018-02-15'),
        now: moment('2018-02-00'),
        roundToPrecision: false
      }
    ];

    cases('should throw error', ({ from, to, now, roundToPrecision = true, preventFuture = true }) => {
      const getInvalidDateRange = () => metricsHelpers.getValidDateRange({ from, to, now, roundToPrecision, preventFuture });
      expect(getInvalidDateRange).toThrowErrorMatchingSnapshot();
    }, invalidCases);

    it('should use input range if valid and rounded up to nearest precision', () => {
      const from = moment('2018-01-15T11:00Z');
      const to = moment('2018-01-16T11:59Z');
      const now = moment('2018-02-01T11:00Z');

      const validRange = metricsHelpers.getValidDateRange({ from, to, now, roundToPrecision: true, preventFuture: true });
      expect(validRange).toEqual({ from, to: to.endOf('minute') });
    });

    it('should use input range if valid, when not rounding', () => {
      const from = moment('2018-01-15T11:00Z');
      const to = moment('2018-01-16T11:33Z');
      const now = moment('2018-02-01T11:33Z');

      const validRange = metricsHelpers.getValidDateRange({ from, to, now, roundToPrecision: false, preventFuture: true });
      expect(validRange).toEqual({ from, to });
    });

    it('should use input range if valid when "now" is not provided', () => {
      const from = moment('2018-01-15T11:00Z');
      const to = moment('2018-01-16T11:59Z');

      const validRange = metricsHelpers.getValidDateRange({ from, to, roundToPrecision: true, preventFuture: true });
      expect(validRange).toEqual({ from, to: to.endOf('minute') });
    });

    it('should use current time if input "to" is later than now', () => {
      const from = moment('2018-01-15T11:00Z');
      const to = moment('2018-01-19T11:59Z'); // would use day precision if valid
      const now = moment('2018-01-15T11:23Z'); // will instead use minute precision

      const validRange = metricsHelpers.getValidDateRange({ from, to, now, roundToPrecision: true, preventFuture: true });
      expect(validRange).toEqual({ from, to: now });
    });

    it('should use current time and round it if input "to" is later than now and precision is greater than a minute', () => {
      const from = moment('2018-01-15T11:00Z');
      const to = moment('2018-01-17T10:59Z');
      const now = moment('2018-01-16T11:23Z');

      const validRange = metricsHelpers.getValidDateRange({ from, to, now, roundToPrecision: true, preventFuture: true });
      expect(validRange.from).toEqual(from);
      expect(validRange.to.toISOString()).toEqual(moment('2018-01-16T11:59Z').endOf('minute').toISOString());
    });

    it('should use rounded input if equal to rounded now', () => {
      const from = moment('2018-01-17T12:00Z');
      const to = moment('2018-01-19T11:27Z');
      const now = moment('2018-01-19T11:23Z');

      const validRange = metricsHelpers.getValidDateRange({ from, to, now, roundToPrecision: true, preventFuture: true });
      expect(validRange.from).toEqual(from);
      expect(validRange.to.toISOString()).toEqual(moment('2018-01-19T11:59Z').endOf('minute').toISOString());
    });

    it('should allow past or future dates if preventFuture is false', () => {
      const from = moment('2018-01-19T12:00Z');
      const now = moment('2018-01-20T12:00Z');
      const to = moment('2018-01-21T12:00Z');

      const validRange = metricsHelpers.getValidDateRange({ from, to, now, roundToPrecision: false, preventFuture: false });
      expect(validRange).toEqual({ from, to });
    });
  });
});
