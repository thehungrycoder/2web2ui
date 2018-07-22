import * as analytics from 'src/helpers/analytics';

const timestamp = 1523978057120;

Date = jest.fn(() => ({ /* eslint-disable-line no-global-assign */
  getTime: () => timestamp
}));

describe('Analytics instrumentation', () => {
  beforeEach(() => {
    delete window.dataLayer;
    analytics.setup();
  });

  describe('setup', () => {
    it('should initialise dataLayer with the Page View event', () => {
      expect(window.dataLayer).toEqual([{ event: 'gtm.js', 'gtm.start': timestamp }]);
    });

    it('should not overwrite an existing dataLayer', () => {
      analytics.setup();
      expect(window.dataLayer).toHaveLength(1);
    });
  });

  describe('trackPageview', () => {
    const path = '/path/to/funsies';
    const title = 'The Funsies Page';
    it('should push a content-view event', () => {
      analytics.trackPageview({ path, title });
      expect(window.dataLayer.pop()).toEqual({
        event: 'content-view',
        'content-name': path,
        'content-title': title
      });
    });
  });

  describe('trackEvent', () => {
    const category = 'cat';
    const action = 'woof';
    const data = { species: 'plankton' };

    it('should push the specified event', () => {
      analytics.trackEvent({ category, action, data });
      expect(window.dataLayer.pop()).toEqual({
        event: category,
        'event-action': action,
        'event-data': data
      });
    });

    it('should provide empty event data by default', () => {
      analytics.trackEvent({ category, action });
      expect(window.dataLayer.pop()).toEqual({
        event: category,
        'event-action': action,
        'event-data': {}
      });
    });
  });

  describe('trackFormSuccess', () => {
    const action = 'gogogo';
    const data = { hut: 'hut-shed-hut' };

    it('should push a Completed form event', () => {
      analytics.trackFormSuccess(action, data);
      expect(window.dataLayer.pop()).toEqual({
        event: 'Completed form',
        'event-action': action,
        'event-data': data
      });
    });
  });

  describe('setVariable', () => {
    const varName = 'Nameio';
    const varValue = 'McVarington';

    it('should push a variable', () => {
      analytics.setVariable(varName, varValue);
      expect(window.dataLayer.pop()).toEqual({ [varName]: varValue });
    });
  });

  describe('pushEvents', () => {
    it('invokes pushEvent correct', () => {
      const data = [{ hut2: 'hut-shed-hut2' }, { hut3: 'hut-shed-hut3' }];
      analytics.pushEvents(data);
      expect(window.dataLayer.pop()).toEqual(data[1]);
      expect(window.dataLayer.pop()).toEqual(data[0]);
    });
  });
});
