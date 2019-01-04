import * as transformData from 'src/pages/reports/messageEvents/helpers/transformData.js';
import { getEmptyFilters } from 'src/helpers/messageEvents.js';
import { EVENTS_SEARCH_FILTERS } from 'src/constants';

describe('Message Events page helpers`', () => {
  const emptyFilters = getEmptyFilters(EVENTS_SEARCH_FILTERS);

  describe('getFiltersFromSearchQueries', () => {
    it('returns correct filters object when given a new filter', () => {
      expect(transformData.getFiltersFromSearchQueries([{
        key: 'foo',
        value: 'bar'
      }])).toEqual({ foo: ['bar'], ...emptyFilters });
    });

    it('returns correct filters object when given no filters', () => {
      expect(transformData.getFiltersFromSearchQueries()).toEqual(emptyFilters);
    });
  });

  describe('getSearchQueriesFromFilters', () => {
    it('returns correct search queries array when given filters object', () => {
      const filters = { foo: ['bar, bar2'], foo2: []};
      const searchQuery = [{ key: 'foo', value: 'bar, bar2' }];
      expect(transformData.getSearchQueriesFromFilters(filters)).toEqual(searchQuery);
    });
  });

  describe('getFiltersAsArray', () => {
    it('returns an array of filters with the form {key, value}', () => {
      const input = { recipient_domains: { label: 'Recipient Domains' },
        from_addresses: { label: 'From Addresses' }};
      const output = [
        { value: 'recipient_domains', label: 'Recipient Domains' },
        { value: 'from_addresses', label: 'From Addresses' }
      ];
      expect(transformData.getFiltersAsArray(input)).toEqual(output);
    });
  });

  describe('getBooleanEventsObject', () => {
    it('returns an object of events', () => {
      const input = ['click'];
      const output = { click: true };
      expect(transformData.getBooleanEventsObject(input)).toEqual(output);
    });
  });
});
