import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import _ from 'lodash';
import { authenticate, ssoCheck, login } from 'src/actions/auth';
import { verifyAndLogin } from 'src/actions/tfa';
import { SparkPost } from 'src/components';
import { Panel, Error } from '@sparkpost/matchbox';
import { SubmissionError } from 'redux-form';
import selectAccessConditionState from 'src/selectors/accessConditionState';

import config from 'src/config';
import LoginForm from './components/LoginForm';
import TfaForm from './components/TfaForm';
import styles from './AuthPage.module.scss';

export class AuthPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ssoEnabled: config.sso.enabled
    };
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

  renderRedirect() {
    const { location, currentUser } = this.props;
    const redirectAfterLogin = _.get(location, 'state.redirectAfterLogin');

    if (redirectAfterLogin) {
      return <Redirect to={redirectAfterLogin} />;
    }

    // TODO: create a universally accessible dashboard and redirect everyone there,
    // then handle access in an in-page modular way on that dashboard
    const redirectTo = (currentUser.access_level === 'reporting') ? '/reports/summary' : config.splashPage;
    return <Redirect to={redirectTo} />;
  }

  componentWillReceiveProps(nextProps) {
    const { ssoUser } = nextProps.auth;

    if (typeof ssoUser === 'undefined') { //anytime before action is dispatched
      return;
    }

    if (ssoUser) {
      window.location.assign(`${config.apiBase}/users/saml/login`);
    } else {
      this.setState({ ssoEnabled: false });
    }
  }

  loginSubmit = (values) => {
    const { username, password, rememberMe } = values;
    this.state.ssoEnabled ? this.ssoSignIn(username) : this.regularSignIn(username, password, rememberMe);
  }

  tfaSubmit = (values) => {
    const { code } = values;
    const { tfaEnabled, ...authData } = this.props.tfa;
    return this.props.verifyAndLogin({ authData, code }).catch((err) => {
      if (err.response.status === 400) {
        throw new SubmissionError({
          code: 'The code is invalid'
        });
      }
    });
  }

  render() {
    const { ready } = this.props;
    const { errorDescription, loggedIn } = this.props.auth;
    const { tfaEnabled } = this.props.tfa;

    if (ready && loggedIn) {
      return this.renderRedirect();
    }

    return (
      <div>
        <div className={styles.LogoWrapper}>
          <a href="https://www.sparkpost.com" title="SparkPost">
            <SparkPost.Logo />
          </a>
        </div>

        <Panel sectioned accent title="Log In">
          { errorDescription && this.renderLoginError(errorDescription)}

          { tfaEnabled && <TfaForm onSubmit={this.tfaSubmit} /> }
          { !tfaEnabled && <LoginForm onSubmit={this.loginSubmit} ssoEnabled={this.state.ssoEnabled}/> }
        </Panel>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { auth, tfa } = state;
  return {
    auth,
    tfa,
    ...selectAccessConditionState(state)
  };
};

export default connect(mapStateToProps, { login, verifyAndLogin, authenticate, ssoCheck })(AuthPage);
