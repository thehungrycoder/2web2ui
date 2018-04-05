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

  describe('selectMessageEventsSearchOptions', () => {
    const state = {
      messageEvents: {
        search: {
          dateOptions: {
            from: '2018-03-23T17:10:08-04:00',
            to: '2018-03-23T17:11:08-04:00',
            relativeRange: 'hour'
          }
        }
      }
    };

    it('prepares message events reportOptions for URL sharing', () => {
      expect(selectors.selectMessageEventsSearchOptions(state)).toMatchSnapshot();
    });
  });
});

describe('isMessageHistoryEmpty', () => {
  it('should return true', () => {
    const state = {
      messageEvents: {
        history: {
          abc: []
        }
      }
    };
    const props = { match: { params: { messageId: 'abc' }}};

    expect(selectors.isMessageHistoryEmpty(state, props)).toEqual(true);
  });

  it('should return false with message events', () => {
    const state = {
      messageEvents: {
        history: {
          abc: [
            { event_id: '123', message_id: 'abc' },
            { event_id: '234', message_id: 'abc' }
          ]
        }
      }
    };
    const props = { match: { params: { messageId: 'abc' }}};

    expect(selectors.isMessageHistoryEmpty(state, props)).toEqual(false);
  });

  it('should return false with no events', () => {
    const state = {
      messageEvents: {
        history: {}
      }
    };
    const props = { match: { params: { messageId: 'abc' }}};

    expect(selectors.isMessageHistoryEmpty(state, props)).toEqual(false);
  });
});
