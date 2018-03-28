import * as selectors from '../cookieConsent';
import * as currentUserSelectors from '../currentUser';

jest.mock('../currentUser');

describe('Selector: Cookie Consent', () => {
  describe('consentCookieSetSelector', () => {
    it('should select cookie state', () => {
      expect(selectors.consentCookieSetSelector({ cookieConsent: { cookieSet: true }})).toEqual(true);
    });
  });

  describe('cookieConsentGivenSelector', () => {
    it('should include cookie state', () => {
      currentUserSelectors.userCookieConsentFlagSelector.mockReturnValueOnce(false);
      expect(selectors.cookieConsentGivenSelector({ cookieConsent: { cookieSet: true }})).toEqual(true);
    });

    it('should include user flag state', () => {
      currentUserSelectors.userCookieConsentFlagSelector.mockReturnValueOnce(true);
      expect(selectors.cookieConsentGivenSelector({ cookieConsent: { cookieSet: false }})).toEqual(true);
    });
  });
});

