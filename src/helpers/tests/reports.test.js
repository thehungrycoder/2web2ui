import * as reports from '../reports';
import * as dateHelpers from 'src/helpers/date';
import cases from 'jest-in-case';

jest.mock('src/actions/reportFilters');
jest.mock('src/helpers/date');

beforeEach(() => {
  dateHelpers.getRelativeDates = jest.fn(() => ({}));
});

it('Should get search options', () => {
  const filters = {
    from: 1487076708000,
    to: 1587076708000,
    activeList: [
      { type: 'type', value: '123' }
    ]
  };
  expect(reports.getFilterSearchOptions(filters)).toMatchSnapshot();
});

it('Should parse search with relative range', () => {
  const filters = 'filters=Domain:test.com&filters=Subaccount:test:123';
  const date = 'from=2017-11-03T14:43:00Z&to=2017-11-04T14:43:00Z';
  const metrics = 'metrics=count-something';
  const range = 'range=day';
  const search = `?${filters}&${date}&${metrics}&${range}`;

  dateHelpers.getRelativeDates = jest.fn(() => ({
    from: 'relative-from',
    to: 'relative-to'
  }));

  expect(reports.parseSearch(search)).toMatchSnapshot();
  expect(dateHelpers.getRelativeDates).toHaveBeenCalledWith('day');
});

it('Should parse search with custom range', () => {
  const filters = 'filters=Domain:test.com&filters=Subaccount:test:123';
  const date = 'from=2017-11-03T14:43:00Z&to=2017-11-04T14:43:00Z';
  const metrics = 'metrics=count-something';
  const range = 'range=custom';
  const search = `?${filters}&${date}&${metrics}&${range}`;

  expect(reports.parseSearch(search)).toMatchSnapshot();
  expect(dateHelpers.getRelativeDates).toHaveBeenCalledWith('custom');
});

it('Should parse search with missing range (as custom)', () => {
  const filters = 'filters=Domain:test.com&filters=Subaccount:test:123';
  const date = 'from=2017-11-03T14:43:00Z&to=2017-11-04T14:43:00Z';
  const metrics = 'metrics=count-something';
  const search = `?${filters}&${date}&${metrics}`;

  expect(reports.parseSearch(search)).toMatchSnapshot();
  expect(dateHelpers.getRelativeDates).toHaveBeenCalledWith('custom');
});

it('Should parse search with no empty value', () => {
  expect(reports.parseSearch('')).toMatchSnapshot();
});

const TIME_RANGE_TESTS = {
  'should return hour for 1 hr diff': {
    from: '2017-10-10 10:00:00',
    to: '2017-10-10 11:00:00',
    value: 'hour'
  },
  'should return 24 hours for 1 day diff': {
    from: '2017-10-09 10:00:00',
    to: '2017-10-10 10:00:00',
    value: '24 hours'
  },
  'should return 30 days for 1 month diff': {
    from: '2017-09-09 10:00:00',
    to: '2017-10-09 10:00:00',
    value: '30 days'
  },
  'should return 2 days for 2 dayish diff': {
    from: '2017-10-07 00:00:00',
    to: '2017-10-09 07:00:00',
    value: '2 days'
  }
};

cases('human time ranges', ({ from, to, value }) => {
  expect(reports.humanizeTimeRange(from, to)).toEqual(value);
}, TIME_RANGE_TESTS);
