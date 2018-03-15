import * as selectors from '../messageEvents';

const events = [
  {
    event_id: 'default_id',
    foo: 'bar',
    timestamp: '2017-11-09T00:00'
  },
  {
    bat: 'baz',
    foo: 'bar',
    timestamp: '2017-11-08T11:00'
  }
];

const messageEvents = { events: events };
const messageHistory = { history: { message_id: events }};

const props = {
  match: {
    params: {
      messageId: 'message_id'
    }
  },
  location: {
    state: {
      selectedEventId: 'selected_id'
    }
  }
};

describe('Selectors: Message Events', () => {
  it('returns formatted message event data', () => {
    expect(selectors.selectMessageEvents({ messageEvents })).toMatchSnapshot();
  });
});

describe('Selectors: Message History', () => {
  it('returns formatted message history data', () => {
    expect(selectors.selectMessageHistory({ messageEvents: messageHistory }, props)).toMatchSnapshot();
  });
});

describe('Selectors: Initial Event Id', () => {
  it('returns event_id', () => {
    expect(selectors.selectInitialEventId({ messageEvents: messageHistory }, props)).toMatchSnapshot();
  });

  it('returns default event_id', () => {
    props.location.state.selectedEventId = null;
    expect(selectors.selectInitialEventId({ messageEvents: messageHistory }, props)).toMatchSnapshot();
  });

  it('returns default event_id with no location state', () => {
    props.location = null;
    expect(selectors.selectInitialEventId({ messageEvents: messageHistory }, props)).toMatchSnapshot();
  });
});
