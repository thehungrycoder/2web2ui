import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { authenticate, ssoCheck, login } from 'src/actions/auth';
import { verifyAndLogin } from 'src/actions/tfa';
import { CenteredLogo } from 'src/components';
import { Panel, Error, UnstyledLink } from '@sparkpost/matchbox';
import { SubmissionError } from 'redux-form';

import config from 'src/config';
import { DEFAULT_REDIRECT_ROUTE } from 'src/constants';
import LoginForm from './components/LoginForm';
import TfaForm from './components/TfaForm';

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
    const { ssoUser, loggedIn } = nextProps.auth;

    if (loggedIn) {
      this.redirect(nextProps);
      return;
    }

    if (typeof ssoUser === 'undefined') { // we don't know if you're an ssoUser yet
      return;
    }

    if (ssoUser) {
      window.location.assign(`${config.apiBase}/users/saml/login`);
    } else {
      this.setState({ ssoEnabled: false });
    }
  }

  redirect(nextProps) {
    const route = _.get(nextProps, 'location.state.redirectAfterLogin', DEFAULT_REDIRECT_ROUTE);
    this.props.history.push(route);
  }

  ssoSignIn(username) {
    return this.props.ssoCheck(username).catch((err) => err);
  }

  regularSignIn(username, password, rememberMe) {
    return this.props.authenticate(username, password, rememberMe);
  }

  renderLoginError(errorDescription) {
    return (
      <Error error={errorDescription} />
    );
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
    const { errorDescription } = this.props.auth;
    const hasSignup = (config.featureFlags || {}).has_signup;
    const { tfa } = this.props;

    const footerMarkup = !tfa.enabled
      ? <Panel.Footer
        left={hasSignup && <small>Don't have an account? <UnstyledLink Component={Link} to='/join'>Sign up</UnstyledLink>.</small>}
        right={<small><UnstyledLink Component={Link} to='/forgot-password'>Forgot your password?</UnstyledLink></small>} />
      : null;

    return (
      <div>
        <CenteredLogo />
        <Panel sectioned accent title="Log In">
          { errorDescription && this.renderLoginError(errorDescription)}

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
