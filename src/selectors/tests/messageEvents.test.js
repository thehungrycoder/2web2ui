import * as selectors from '../messageEvents';


describe('MessageEvents Selectors', () => {
  let props;
  let messageEvents;
  let messageHistory;

  beforeEach(() => {
    props = {
      match: {
        params: {
          messageId: 'message_id',
          eventId: 'selected_id'
        }
      }
    };

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

    messageEvents = { events: events };
    messageHistory = { history: { message_id: events }};

  });


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
      props.match.params.eventId = null;
      expect(selectors.selectInitialEventId({ messageEvents: messageHistory }, props)).toMatchSnapshot();
    });
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

  describe('isMessageHistoryEmpty', () => {
    it('should return true when messageId is not in history', () => {
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

    it('should return false when messageId is in history', () => {
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

    it('should return true when history is empty', () => {
      const state = {
        messageEvents: {
          history: {}
        }
      };
      const props = { match: { params: { messageId: 'abc' }}};

      expect(selectors.isMessageHistoryEmpty(state, props)).toEqual(true);
    });
  });

  describe('getSelectedEventFromMessageHistory', () => {
    it('returns correct event from messageHistory', () => {
      props.match.params.eventId = 'default_id';
      expect(selectors.getSelectedEventFromMessageHistory({ messageEvents: messageHistory }, props)).toMatchSnapshot();
    });

    it('returns undefined if event does not exist in messageHistory', () => {
      expect(selectors.getSelectedEventFromMessageHistory({ messageEvents: messageHistory }, props)).toBe(undefined);
    });
  });

  describe('getSelectedEventFromEventsList', () => {
    it('returns correct event from events list', () => {
      props.match.params.eventId = 'default_id';
      expect(selectors.getSelectedEventFromEventsList({ messageEvents }, props)).toMatchSnapshot();
    });

    it('returns undefined if event does not exist in messageHistory', () => {
      expect(selectors.getSelectedEventFromEventsList({ messageEvents }, props)).toBe(undefined);
    });
  });

  describe('getMessageIdParam', () => {
    it('returns correct messageId value from path', () => {
      expect(selectors.getMessageIdParam({}, { match: { params: { messageId: 'xyz' }}})).toEqual('xyz');
    });

    it('returns undefined when messageId is absent', () => {
      expect(selectors.getMessageIdParam({}, { match: { params: {}}})).toBe(undefined);
    });
  });

  describe('eventPageMSTP', () => {
    let store;
    let props;
    beforeEach(() => {
      store = { messageEvents: { ...messageHistory, documentation: {}}};
      props = { match: { params: { messageId: 'message_id', eventId: 'default_id' }}};
    });

    it('returns correct props for event with message_id', () => {
      expect(selectors.eventPageMSTP()(store, props)).toMatchSnapshot();
    });

    it('returns correct props for orphan event (w/o message_id)', () => {
      props.match.params.messageId = '<empty>';
      expect(selectors.eventPageMSTP()(store, props)).toMatchSnapshot();
    });


  });
});
