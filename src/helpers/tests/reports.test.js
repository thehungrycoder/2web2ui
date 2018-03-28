import * as reports from '../reports';
import * as dateHelpers from 'src/helpers/date';

jest.mock('src/helpers/date');
jest.mock('src/helpers/string', () => ({
  stringifyTypeaheadfilter: jest.fn((filter) => filter.id)
}));

describe('report helpers', () => {

  describe('parseSearch', () => {
    beforeEach(() => {
      dateHelpers.getRelativeDates = jest.fn(() => ({}));
    });

    it('should parse search with relative range', () => {
      const filters = 'filters=Domain:test.com&filters=Subaccount:test:123';
      const date = 'from=2017-11-03T14:43:00Z&to=2017-11-04T14:43:00Z';
      const metrics = 'metrics=count-something';
      const range = 'range=day';
      const search = `?${filters}&${date}&${metrics}&${range}`;

      dateHelpers.getRelativeDates = jest.fn(() => ({
        from: 'relative-from',
        to: 'relative-to',
        relativeRange: 'relative-range'
      }));

      expect(reports.parseSearch(search)).toMatchSnapshot();
      expect(dateHelpers.getRelativeDates).toHaveBeenCalledWith('day');
    });

    it('should parse search with custom range', () => {
      const filters = 'filters=Domain:test.com&filters=Subaccount:test:123';
      const date = 'from=2017-11-03T14:43:00Z&to=2017-11-04T14:43:00Z';
      const metrics = 'metrics=count-something';
      const range = 'range=custom';
      const search = `?${filters}&${date}&${metrics}&${range}`;

      dateHelpers.getRelativeDates = jest.fn(() => ({
        relativeRange: 'custom'
      }));

      expect(reports.parseSearch(search)).toMatchSnapshot();
      expect(dateHelpers.getRelativeDates).toHaveBeenCalledWith('custom');
    });

    it('should parse search with missing range', () => {
      const filters = 'filters=Domain:test.com&filters=Subaccount:test:123';
      const date = 'from=2017-11-03T14:43:00Z&to=2017-11-04T14:43:00Z';
      const metrics = 'metrics=count-something';
      const search = `?${filters}&${date}&${metrics}`;

      expect(reports.parseSearch(search)).toMatchSnapshot();
    });

    it('Should parse search with no empty value', () => {
      expect(reports.parseSearch('')).toMatchSnapshot();
    });
  });

  describe('dedupeFilters', () => {
    it('returns deduped filters', () => {
      const filters = [
        { type: 'Subaccount', value: 'created (ID 698)', id: 698 },
        { type: 'Subaccount', value: 'test create no key (ID 656)', id: 656 },
        { type: 'Subaccount', value: 'created (ID 698)', id: 698 },
        { type: 'not-subaccount', value: 'some random value', id: 550 }
      ];
      expect(reports.dedupeFilters(filters)).toMatchSnapshot();
    });
  });

});
