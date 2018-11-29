export const userCookieConsentFlagSelector = (state) => !!state.currentUser.cookie_consent;

export const usernameSelector = (state) => state.currentUser.username || state.tfa.username || state.auth.username;
