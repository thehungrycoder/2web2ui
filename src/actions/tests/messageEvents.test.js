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
