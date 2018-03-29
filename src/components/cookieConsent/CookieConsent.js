import React from 'react';
import { connect } from 'react-redux';

import { setConsentCookie } from 'src/actions/cookieConsent';
import { userGivesCookieConsent } from 'src/actions/currentUser';

import { consentCookieSetSelector, cookieConsentGivenSelector } from 'src/selectors/cookieConsent';
import { userCookieConsentFlagSelector } from 'src/selectors/currentUser';

import { ConsentBar } from './components/ConsentBar';

export class CookieConsent extends React.Component {
  storeConsent = () => {
    this.props.setConsentCookie();
    this.setConsentFlag();
  };

  setConsentFlag = () => {
    const { accessControlReady, loggedIn, savingFlag, userGivesCookieConsent } = this.props;
    if (accessControlReady && loggedIn && !savingFlag) {
      return userGivesCookieConsent();
    }
  };

  componentDidUpdate() {
    const { cookieSet, userFlagSet, setConsentCookie } = this.props;

    // If cookie is set but user consent flag is not, set the flag to
    // indicate the user has consented but either they consented through another
    // .sparkpost.com property or they were not logged in when they consented.
    if (cookieSet && !userFlagSet) {
      this.setConsentFlag();
    }

    // If the user flag is set, the user has previously consented but has 'lost'
    // the cookie, so set it again.
    if (!cookieSet && userFlagSet) {
      setConsentCookie();
    }
  }

  render() {
    const { accessControlReady, consentGiven } = this.props;

    if (!accessControlReady) {
      return null;
    }

    if (consentGiven) {
      return null;
    }

    return <ConsentBar onDismiss={this.storeConsent}/>;
  }
}

const mapStateToProps = (state) => ({
  consentGiven: cookieConsentGivenSelector(state),
  cookieSet: consentCookieSetSelector(state),
  userFlagSet: userCookieConsentFlagSelector(state),
  savingFlag: state.currentUser.storingCookieConsent,
  accessControlReady: state.accessControlReady,
  loggedIn: state.auth.loggedIn
});

const mapDispatchToProps = { setConsentCookie, userGivesCookieConsent };

// connect consent state, set consent action
export default connect(mapStateToProps, mapDispatchToProps)(CookieConsent);

