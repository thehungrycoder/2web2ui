import { loadScript } from '../loadScript';

describe('loadScript', () => {
  beforeEach(() => {
    window.gtag = jest.fn();
  });

  it('renders script tag correctly', () => {
    expect(loadScript({ url: 'domain.com/script.js' })).toMatchSnapshot();
  });

});
