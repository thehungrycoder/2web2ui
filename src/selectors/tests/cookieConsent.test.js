import * as selectors from '../cookieConsent';
import helpers from 'src/helpers/cookieConsent';
import * as currentUserSelectors from '../currentUser';

jest.mock('src/helpers/cookieConsent');
jest.mock('../currentUser');

describe('Selector: Cookie Consent', () => {
  describe('consentCookieSetSelector', () => {
    it('should select cookie state', () => {
      selectors.consentCookieSetSelector({});
      expect(helpers.isCookieSet).toHaveBeenCalledTimes(1);
    });
  });

  describe('cookieConsentGivenSelector', () => {
    it('should include cookie state', () => {
      currentUserSelectors.userCookieConsentFlagSelector.mockReturnValueOnce(false);
      helpers.isCookieSet.mockReturnValueOnce(true);
      expect(selectors.cookieConsentGivenSelector({})).toEqual(true);
    });

    it('should include user flag state', () => {
      currentUserSelectors.userCookieConsentFlagSelector.mockReturnValueOnce(true);
      helpers.isCookieSet.mockReturnValueOnce(false);
      expect(selectors.cookieConsentGivenSelector({})).toEqual(true);
    });
  });
});

