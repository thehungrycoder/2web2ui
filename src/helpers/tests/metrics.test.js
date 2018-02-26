import * as metricsHelpers from '../metrics';
import moment from 'moment';
import * as dateHelpers from 'src/helpers/date';

describe('metrics helpers', () => {
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

  it('should return hours as precision type', () => {
    expect(metricsHelpers.getPrecisionType('1min')).toEqual('hours');
  });

  it('should return days as precision type', () => {
    expect(metricsHelpers.getPrecisionType('day')).toEqual('days');
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
});
