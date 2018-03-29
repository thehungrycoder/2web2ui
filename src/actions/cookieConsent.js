import helpers from 'src/helpers/cookieConsent';

export const setConsentCookie = () => {
  helpers.setCookie();
  return { type: 'GIVE_COOKIE_CONSENT' };
};

