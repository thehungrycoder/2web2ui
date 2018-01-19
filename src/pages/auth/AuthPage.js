import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { authenticate, ssoCheck, login } from 'src/actions/auth';
import { verifyAndLogin } from 'src/actions/tfa';
import { SparkPost } from 'src/components';
import { Panel, Error } from '@sparkpost/matchbox';
import { SubmissionError } from 'redux-form';

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
    const { errorDescription, loggedIn } = this.props.auth;
    const { tfaEnabled } = this.props.tfa;

    if (loggedIn) {
      return <Redirect to={config.splashPage} />;
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

const mapStateToProps = ({ auth, tfa }) => ({
  auth,
  tfa
});

export default connect(mapStateToProps, { login, verifyAndLogin, authenticate, ssoCheck })(AuthPage);
