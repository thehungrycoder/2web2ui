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
      expect(messageEvents.getMessageHistory({ messageId: 'abcd,efgh', params: { to: 'OVERRIDDEN_TO' }})).toMatchSnapshot();
    });
  });
});
