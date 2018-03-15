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

  describe('updateMessageEventsSearchOptions', () => {
    it('dedupes filters', () => {
      expect(messageEvents.updateMessageEventsSearchOptions({
        subaccounts: ['1','4','1','2','3'],
        message_ids: ['1'],
        campaign_ids: []
      })).toMatchSnapshot();
    });
  });
});
