import helpers from 'src/helpers/cookieConsent';

const initialState = {
  cookieSet: helpers.isCookieSet()
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'GIVE_COOKIE_CONSENT':
      return { ...state, cookieSet: true };

    case 'LOGOUT':
      return { ...state, cookieSet: helpers.isCookieSet() };

    default:
      return state;
  }
};
