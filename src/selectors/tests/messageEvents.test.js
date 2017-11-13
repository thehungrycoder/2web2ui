import { selectMessageEvents } from '../messageEvents';

describe('Selectors: Message Events', () => {
  const state = {
    messageEvents: {
      events: [
        {
          foo: 'bar',
          timestamp: '2017-11-09T00:00'
        },
        {
          bat: 'baz',
          foo: 'bar',
          timestamp: '2017-11-08T11:00'
        }
      ]
    }
  };

  it('returns formatted message event data', () => {
    expect(selectMessageEvents(state)).toMatchSnapshot();
  });
});

