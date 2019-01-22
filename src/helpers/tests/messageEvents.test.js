import cases from 'jest-in-case';
import * as messageEventHelpers from '../messageEvents';
import * as dateHelpers from 'src/helpers/date';

jest.mock('src/constants', () => ({
  EVENTS_SEARCH_FILTERS: {
    filter1: {},
    filter2: {}
  }
}));

describe('messageEvents helpers', () => {

  describe('formatDocumentation', () => {
    let data;

    beforeEach(() => {
      data = [{
        'type': { 'description': 'Type of event this record describes', 'sampleValue': 'bounce' },
        'display_name': { 'description': 'A description of this event', 'sampleValue': 'A test event type' },
        'event_description': { 'description': 'A description of the description', 'sampleValue': 'This event type is for testing event stuff' },
        'bounce_class': {
          'description': 'Classification code for a given message (see [Bounce Classification Codes](https://support.sparkpost.com/customer/portal/articles/1929896))',
          'sampleValue': '1'
        },
        'campaign_id': {
          'description': 'Campaign of which this message was a part',
          'sampleValue': 'Example Campaign Name'
        }
      }, {
        'type': { 'description': 'Type of event this record describes', 'sampleValue': 'delivery' },
        'display_name': { 'description': 'A description of this event', 'sampleValue': 'A second test event type' },
        'event_description': { 'description': 'A description of the description', 'sampleValue': 'This event type is also for testing event stuff' },
        'campaign_id': {
          'description': 'Campaign of which this message was a part',
          'sampleValue': 'Example Campaign Name'
        },
        'customer_id': {
          'description': 'SparkPost-customer identifier through which this message was sent',
          'sampleValue': '1'
        }
      }];
    });

    it('formats documentation correctly', () => {
      expect(messageEventHelpers.formatDocumentation(data)).toMatchSnapshot();
    });
  });

  const testCases = {
    'parses correctly when all param exists': { searchText: '?from=2018-03-23T03:02:32Z&range=hour&to=2018-03-23T04:02:32Z&filter1=foo&filter2=bar' },
    'parses correctly when from does not exist': { searchText: '?range=hour&to=2018-03-23T04:02:32Z&filter1=foo&filter2=bar' },
    'parses correctly when to does not exist': { searchText: '?from=2018-03-23T03:02:32Z&range=hour&filter1=foo&filter2=bar' },
    'parses correctly when range does not exist (does not override from, to)': { searchText: '?from=2018-03-23T03:02:32Z&to=2018-03-23T04:02:32Z&filter1=foo&filter2=bar' },
    'parses correctly when extra filters do not exist': { searchText: '?from=2018-03-23T03:02:32Z&range=hour&to=2018-03-23T04:02:32Z' },
    'parses correctly when using old message events filters by transforming them into the new events filters': {
      searchText: '?from=2018-03-23T03:02:32Z&range=hour&to=2018-03-23T04:02:32Z&campaign_ids=foo&message_ids=foo&transmission_ids=foo&ab_test_ids=foo&template_ids=foo&friendly_froms=foo'
    },
    'parses correctly when adding in unsupported filters by removing them': { searchText: '?from=2018-03-23T03:02:32Z&range=hour&to=2018-03-23T04:02:32Z&filter3' }
  };
  cases('parseSearch', ({ searchText }) => {
    const mockRelativeRangeToDate = { from: '2018-02-23T03:02:32Z', to: '2018-03-22T03:02:32Z', relativeRange: 'hour' };

    dateHelpers.getRelativeDates = jest.fn(() => mockRelativeRangeToDate);

    expect(messageEventHelpers.parseSearch(searchText)).toMatchSnapshot();
  }, testCases);


  describe('getDetailsPath', () => {
    it('returns correct path when messageId and eventId exist', () => {
      expect(messageEventHelpers.getDetailsPath('foo', 'bar')).toEqual('/reports/message-events/details/foo/bar');
    });

    it('returns correct path when messageId is empty', () => {
      expect(messageEventHelpers.getDetailsPath(null, 'bar')).toEqual('/reports/message-events/details/_noid_/bar');
    });
  });

  describe('getEmptyFilters', () => {
    it('returns an object of filters with the key being the filter key and the value as a empty array', () => {
      const input = { foo: {}};
      const output = { foo: []};
      expect(messageEventHelpers.getEmptyFilters(input)).toEqual(output);
    });
  });

});
