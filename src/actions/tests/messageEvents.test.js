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

    let dispatchMock;

    beforeEach(() => {
      dispatchMock = jest.fn((a) => Promise.resolve(a));
    });

    it('should dispatch get action with from/to/recipients', () => {
      const recipients = [1, 2, 3];
      const reportOptions = {
        from: '2018-02-15T12:00:00',
        to: '2018-02-16T12:00:00'
      };
      messageEvents.getMessageEvents({ recipients, reportOptions })(dispatchMock);
      expect(dispatchMock).toHaveBeenCalledWith({
        type: 'GET_MESSAGE_EVENTS',
        meta: {
          method: 'GET',
          url: '/message-events',
          params: {
            from: expect.any(String),
            to: expect.any(String),
            recipients
          }
        }
      });
    });

    it('should dispatch get action with only from', () => {
      const reportOptions = {
        from: '2018-02-15T12:00:00'
      };
      messageEvents.getMessageEvents({ reportOptions })(dispatchMock);
      expect(dispatchMock).toHaveBeenCalledWith({
        type: 'GET_MESSAGE_EVENTS',
        meta: {
          method: 'GET',
          url: '/message-events',
          params: {
            from: expect.any(String)
          }
        }
      });
    });

    it('should dispatch get action with only to', () => {
      const reportOptions = {
        to: '2018-02-16T12:00:00'
      };
      messageEvents.getMessageEvents({ reportOptions })(dispatchMock);
      expect(dispatchMock).toHaveBeenCalledWith({
        type: 'GET_MESSAGE_EVENTS',
        meta: {
          method: 'GET',
          url: '/message-events',
          params: {
            to: expect.any(String)
          }
        }
      });
    });

    it('should dispatch get action with only recipients', () => {
      const recipients = [1, 2, 3];
      const reportOptions = {};
      messageEvents.getMessageEvents({ reportOptions, recipients })(dispatchMock);
      expect(dispatchMock).toHaveBeenCalledWith({
        type: 'GET_MESSAGE_EVENTS',
        meta: {
          method: 'GET',
          url: '/message-events',
          params: {
            recipients
          }
        }
      });
    });

  });

  describe('getMessageHistory', () => {
    it('makes api call with defaults', () => {
      expect(messageEvents.getMessageHistory({ messageId: 'abcd,efgh' })).toMatchSnapshot();
    });

    it('allows overriding "to" param', () => {
      expect(messageEvents.getMessageHistory({ messageId: 'abcd', to: 'OVERRIDDEN_TO' })).toMatchSnapshot();
    });

    it('allows custom params', () => {
      expect(messageEvents.getMessageHistory({ messageId: 'abcd', foo: 'bar', foo2: 'bar2' })).toMatchSnapshot();
    });

    it('does not allow to override message_ids and from params', () => {
      expect(messageEvents.getMessageHistory({ messageId: 'abcd', message_ids: 'wxyz', from: 'OVERRIDDEN_FROM' })).toMatchSnapshot();
    });
  });
});
