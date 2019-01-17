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
    let getStateMock;
    let dispatchMock;
    let testState;

    beforeEach(() => {
      testState = { messageEvents: {
        cachedResultsByPage: [[]],
        linkByPage: ['foo=bar1', 'for=bar2']
      }};
      dispatchMock = jest.fn((a) => a);
      getStateMock = jest.fn(() => testState);
    });
    it('should dispatch change page action', () => {
      const currentPage = 2;

      messageEvents.changePage(currentPage)(dispatchMock, getStateMock);
      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(dispatchMock).toHaveBeenCalledWith({
        type: 'GET_MESSAGE_EVENTS_PAGE',
        meta: {
          currentPageIndex: currentPage - 1,
          method: 'GET',
          params: {
            for: 'bar2'
          },
          showErrorAlert: false,
          url: '/v1/events/message'
        }

      });
    });

    it('should dispatch loading from cache', () => {
      const currentPage = 1;

      messageEvents.changePage(currentPage)(dispatchMock, getStateMock);
      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(dispatchMock).toHaveBeenCalledWith({
        type: 'LOAD_EVENTS_FROM_CACHE',
        payload: currentPage - 1
      });
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
