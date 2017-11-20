import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { authenticate, ssoCheck } from 'src/actions/auth';
import { SparkPost } from 'src/components';
import { Panel } from '@sparkpost/matchbox';

import config from 'src/config';
import LoginForm from './LoginForm';
import styles from './AuthPage.module.scss';

export class AuthPage extends Component {
  redirectToSSO() {
    window.location.href = `${config.apiBase}/api/v1/users/saml/login`;
  }

  ssoSignIn(username) {
    return this.props.ssoCheck(username)
    .then(() => {
      const { ssoEnabled } = this.props.auth;
      if (ssoEnabled) {
        this.redirectToSSO();
      }
    });
  }

  regularSignIn(username, password, rememberMe) {
    return this.props.authenticate(username, password, rememberMe);
  }

  renderLoginError() {
    return (
      <div className="error">
        <p>
          {this.props.auth.errorDescription}
        </p>
      </div>
    );
  }

  renderLoginButtonText() {
    return this.props.auth.loginPending
      ? <span>
          <i className="fa fa-spinner fa-spin" /> Logging In
        </span>
      : <span>Log In</span>;
  }

  onClickSubmit = (values) => {
    const { username, password, rememberMe } = values;
    const { ssoEnabled } = this.props.auth;
    ssoEnabled ? this.ssoSignIn(username) : this.regularSignIn(username, password, rememberMe);
  };

  render() {
    const { errorDescription, loggedIn } = this.props.auth;

    if (loggedIn) {
      return <Redirect to="/dashboard" />;
    }

    return (
      <div>
        <div className={styles.LogoWrapper}>
          <a href="https://www.sparkpost.com" title="SparkPost">
            <SparkPost.Logo />
          </a>
        </div>

        <Panel sectioned accent title="Log In">
          { errorDescription && this.renderLoginError()}

          <LoginForm onSubmit={this.onClickSubmit} />
        </Panel>
      </div>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  auth
});

export default connect(mapStateToProps, { authenticate, ssoCheck })(AuthPage);

