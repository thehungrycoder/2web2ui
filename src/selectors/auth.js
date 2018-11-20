export const authTokenSelector = (state) => state.auth.loggedIn ? state.auth.token : state.tfa.token;
