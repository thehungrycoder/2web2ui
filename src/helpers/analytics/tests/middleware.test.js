import middleware from '../middleware';
import eventsMapper from '../eventsMapper';
import * as analyticsHelpers from '../.';

jest.mock('../.');
jest.mock('../eventsMapper');

describe('Analytics middleware', () => {
  const action = jest.fn();
  const next = jest.fn((a) => a); // passthrough
  const subject = middleware()(next);

  it('pushes an event', () => {
    const event = jest.fn();
    eventsMapper.mockReturnValue(event);

    expect(subject(action)).toEqual(action);
    expect(eventsMapper).toHaveBeenCalledWith(action);
    expect(analyticsHelpers.pushEvent).toHaveBeenCalledWith(event);
  });

  it('ignores action', () => {
    eventsMapper.mockReturnValue(undefined);

    expect(subject(action)).toEqual(action);
    expect(eventsMapper).toHaveBeenCalledWith(action);
  });
});
