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
    // Attempt to store cookie consent to user resource once, if not already
    // saving, and logged in and access control is ready.
    const { accessControlReady, loggedIn, savingFlag, saveFailed, userGivesCookieConsent } = this.props;
    if (accessControlReady && loggedIn && !savingFlag && !saveFailed) {
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
    const { consentGiven } = this.props;

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
  saveFailed: state.currentUser.consentFailed === true,
  accessControlReady: state.accessControlReady,
  loggedIn: state.auth.loggedIn
});

const mapDispatchToProps = { setConsentCookie, userGivesCookieConsent };

// connect consent state, set consent action
export default connect(mapStateToProps, mapDispatchToProps)(CookieConsent);

