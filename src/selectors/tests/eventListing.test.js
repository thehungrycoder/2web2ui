import { selectEventListing, selectMessageEventsEventListing } from '../eventListing';

test('eventListing should transform event docs, sorted alpha-order by display_name', () => {
  const state = {
    webhooks: {
      docs: {
        group1: {
          events: {
            event1: { a: 1, b: 2, display_name: 'C' },
            event2: { a: 11, b: 22, display_name: 'B' }
          }
        },
        group2: {
          events: {
            event3: { a: 111, b: 222, display_name: 'A' },
            event4: { a: 1111, b: 2222, display_name: 'D' }
          }
        }
      }
    }
  };

  expect(selectEventListing(state)).toEqual([
    { key: 'event3', a: 111, b: 222, display_name: 'A' },
    { key: 'event2', a: 11, b: 22, display_name: 'B' },
    { key: 'event1', a: 1, b: 2, display_name: 'C' },
    { key: 'event4', a: 1111, b: 2222, display_name: 'D' }
  ]);
});

test('should return a sorted list of message event doc keys', () => {
  const state = {
    messageEvents: {
      documentation: {
        open: {},
        initial_open: {}
      }
    }
  };
  expect(selectMessageEventsEventListing(state)).toEqual([
    'initial_open',
    'open'
  ]);
});
