import * as messageEvents from '../messageEvents';
import { fn as mockMoment } from 'moment';

jest.mock('../helpers/sparkpostApiRequest', () => jest.fn((a) => a));

describe('Action Creator: MessageEvents', () => {
  beforeEach(() => {
    mockMoment.format = jest.fn().mockReturnValue('2018-02-01T10:10');
  });

  afterAll(() => {
    mockMoment.format.mockReset();
  });

  describe('getMessageEvents', () => {
    it('should dispatch get action with from/to/recipients', () => {
      const recipients = [1, 2, 3];
      const dateOptions = {
        from: '2018-02-15T12:00:00',
        to: '2018-02-16T12:00:00'
      };

      expect(messageEvents.getMessageEvents({ dateOptions, recipients })).toMatchSnapshot();
    });

    it('should dispatch get action with only from', () => {
      const dateOptions = {
        from: '2018-02-15T12:00:00'
      };

      expect(messageEvents.getMessageEvents({ dateOptions })).toMatchSnapshot();
    });

    it('should dispatch get action with only to', () => {
      const dateOptions = {
        to: '2018-02-16T12:00:00'
      };

      expect(messageEvents.getMessageEvents({ dateOptions })).toMatchSnapshot();
    });

    it('should dispatch get action with only recipients', () => {
      const recipients = [1, 2, 3];
      const dateOptions = {};

      expect(messageEvents.getMessageEvents({ dateOptions, recipients })).toMatchSnapshot();
    });
  });

  describe('changePage', () => {
    let cachedResultsByPage; let linkByPage;
    beforeEach(() => {
      cachedResultsByPage = [[]];
      linkByPage = ['foo=bar1','for=bar2'];
    });
    it('should dispatch change page action', () => {
      const currentPage = 2;

      expect(messageEvents.changePage({ linkByPage, currentPage, cachedResultsByPage })).toMatchSnapshot();
    });

    it('should dispatch loading from cache', () => {
      const currentPage = 1;

      expect(messageEvents.changePage({ linkByPage, currentPage, cachedResultsByPage })).toMatchSnapshot();
    });
  });

  describe('getMessageHistory', () => {
    it('makes api call with defaults', () => {
      expect(messageEvents.getMessageHistory({ messageId: 'abcd,efgh' })).toMatchSnapshot();
    });
  });

  describe('updateMessageEventsSearchOptions', () => {
    it('dedupes filters', () => {
      expect(messageEvents.updateMessageEventsSearchOptions({
        subaccounts: ['1','4','1','2','3'],
        message_ids: ['1'],
        campaigns: [],
        dateOptions: {}
      })).toMatchSnapshot();
    });
  });
});
