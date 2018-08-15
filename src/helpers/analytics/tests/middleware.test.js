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

    subject(action);

    expect(analyticsHelpers.pushEvent).toHaveBeenCalledWith(event);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('does not push an event', () => {
    eventsMapper.mockReturnValue(undefined);
    subject(action);

    expect(next).toHaveBeenCalledWith(action);
  });
});
