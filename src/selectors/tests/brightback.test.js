import { selectBrightbackData } from '../brightback';
import * as dateMock from 'src/helpers/date';

jest.mock('src/helpers/date');

describe('Selectors: brightback', () => {
  const state = {
    account: {
      created: '2017-11-15T10:00:00.000Z',
      customer_id: 101
    }
  };

  beforeEach(() => {
    global.Date = jest.fn(() => ({
      getTime: jest.fn(() => 1500000000000),
      toISOString: jest.fn(() => '2017-11-15T10:00:00.000Z')
    }));
    dateMock.getLocalTimezone = jest.fn(() => 'UTC');
  });

  it('returns data to be passed onto brightback', () => {
    expect(selectBrightbackData(state)).toMatchSnapshot();
  });
});
