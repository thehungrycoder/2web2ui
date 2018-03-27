import { createSelector } from 'reselect';
import helpers from 'src/helpers/cookieConsent';

import { userCookieConsentFlagSelector } from './currentUser';

export const consentCookieSetSelector = helpers.isCookieSet;

export const cookieConsentGivenSelector = createSelector(
  [ consentCookieSetSelector, userCookieConsentFlagSelector ],
  (cookieSet, userConsentGiven) => cookieSet || userConsentGiven
);
