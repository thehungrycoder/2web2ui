import { setConsentCookie } from '../cookieConsent';

import helpers from 'src/helpers/cookieConsent';

jest.mock('src/helpers/cookieConsent');

describe('Action Creator: cookie consent ', () => {
  describe('setConsentCookie', () => {
    it('should set the cookie', () => {
      helpers.setCookie.mockReturnValue(true);
      expect(setConsentCookie()).toMatchSnapshot();
      expect(helpers.setCookie).toHaveBeenCalledTimes(1);
    });
  });
});

