import * as googleAnalytics from '../googleAnalytics';

describe('googleAnaltyics', () => {
  beforeEach(() => {
    window.gtag = jest.fn();
  });

  describe('addEvent', () => {
    it('calls gaTag with correct params', () => {
      googleAnalytics.addEvent('a', 'b', { c: 'd' });
      expect(window.gtag).toHaveBeenCalledWith('config', 'no-default-set', { event_category: 'a', event_action: 'b', data: { c: 'd' }});
    });
  });

});
