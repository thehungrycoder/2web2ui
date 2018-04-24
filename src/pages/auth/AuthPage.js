import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import qs from 'query-string';
import { authenticate, ssoCheck, login } from 'src/actions/auth';
import { verifyAndLogin } from 'src/actions/tfa';
import { CenteredLogo } from 'src/components';
import { Panel, Error, UnstyledLink } from '@sparkpost/matchbox';
import { SubmissionError } from 'redux-form';

import config from 'src/config';
import { DEFAULT_REDIRECT_ROUTE } from 'src/constants';
import LoginForm from './components/LoginForm';
import TfaForm from './components/TfaForm';
import { decodeBase64 } from 'src/helpers/string';

export class AuthPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ssoEnabled: config.sso.enabled
    };
  }

  componentDidMount() {
    if (this.props.auth.loggedIn) {
      this.redirect();
      return;
    }
  }

  componentWillReceiveProps(nextProps) {
    const { ssoUser, loggedIn, username } = nextProps.auth;

    if (loggedIn) {
      this.redirect(nextProps);
      return;
    }

    if (typeof ssoUser === 'undefined') { // we don't know if you're an ssoUser yet
      return;
    }

    if (ssoUser) {
      window.location.assign(`${config.apiBase}/users/saml/login/${username}`);
    } else {
      this.setState({ ssoEnabled: false });
    }
  }

  redirect(nextProps) {
    // Passes location state through '/' or '/auth'
    // DefaultRedirect component handles protected routes
    const defaultRoute = { ...this.props.location, pathname: DEFAULT_REDIRECT_ROUTE };
    const route = _.get(nextProps, 'location.state.redirectAfterLogin', defaultRoute);
    this.props.history.push(route);
  }

  ssoSignIn(username) {
    return this.props.ssoCheck(username);
  }

  regularSignIn(username, password, rememberMe) {
    return this.props.authenticate(username, password, rememberMe);
  }

  loginSubmit = (values) => {
    const { username, password, rememberMe } = values;
    this.state.ssoEnabled ? this.ssoSignIn(username) : this.regularSignIn(username, password, rememberMe);
  }

  tfaSubmit = (values) => {
    const { code } = values;
    const { enabled, ...authData } = this.props.tfa;
    return this.props.verifyAndLogin({ authData, code }).catch((err) => {
      if (err.response.status === 400) {
        throw new SubmissionError({
          code: 'The code is invalid'
        });
      }
    });
  }

  render() {
    const { auth, location, tfa } = this.props;
    const hasSignup = (config.featureFlags || {}).has_signup;
    const search = qs.parse(location.search);
    const loginError = decodeBase64(search.error) || auth.errorDescription; // SSO or submit error

    const footerMarkup = !tfa.enabled
      ? <Panel.Footer
        left={hasSignup && <small>Don't have an account? <UnstyledLink Component={Link} to='/join'>Sign up</UnstyledLink>.</small>}
        right={<small><UnstyledLink Component={Link} to='/forgot-password'>Forgot your password?</UnstyledLink></small>} />
      : null;

    return (
      <div>
        <CenteredLogo />
        <Panel sectioned accent title="Log In">
          {loginError && <Error error={loginError} />}

          { tfa.enabled && <TfaForm onSubmit={this.tfaSubmit} /> }
          { !tfa.enabled && <LoginForm onSubmit={this.loginSubmit} ssoEnabled={this.state.ssoEnabled}/> }
        </Panel>
        {footerMarkup}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { auth, tfa } = state;
  return {
    auth,
    tfa
  };
};

export default connect(mapStateToProps, { login, verifyAndLogin, authenticate, ssoCheck })(AuthPage);
