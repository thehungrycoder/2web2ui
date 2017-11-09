import { formatMessageEvents } from '../messageEvents';

describe('Selectors: Message Events', () => {
  const results = [
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

  it('returns formatted message event data', () => {
    expect(formatMessageEvents(results)).toMatchSnapshot();
  });
});

