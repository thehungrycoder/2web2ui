import { createSelector } from 'reselect';

import { userCookieConsentFlagSelector } from './currentUser';

export const consentCookieSetSelector = (state) => state.cookieConsent.cookieSet;

export const cookieConsentGivenSelector = createSelector(
  [ consentCookieSetSelector, userCookieConsentFlagSelector ],
  (cookieSet, userConsentGiven) => cookieSet || userConsentGiven
);
