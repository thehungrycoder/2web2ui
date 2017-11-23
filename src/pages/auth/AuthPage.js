import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { authenticate, ssoCheck } from 'src/actions/auth';
import { SparkPost } from 'src/components';
import { Panel, Error } from '@sparkpost/matchbox';

import config from 'src/config';
import LoginForm from './components/LoginForm';
import styles from './AuthPage.module.scss';

export class AuthPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ssoEnabled: config.sso.enabled
    };
  }

  redirectToSSO() {
    window.location.href = `${config.apiBase}/api/v1/users/saml/login`;
  }

  ssoSignIn(username) {
    return this.props.ssoCheck(username);
  }

  regularSignIn(username, password, rememberMe) {
    return this.props.authenticate(username, password, rememberMe);
  }

  renderLoginError() {
    return (
      <Error error={this.props.auth.errorDescription} />
    );
  }

  componentWillReceiveProps(nextProps) {
    const { ssoUser } = nextProps.auth;

    if (typeof ssoUser === 'undefined') { //anytime before action is dispatched
      return;
    }

    if (ssoUser) {
      this.redirectToSSO();
    } else {
      this.setState({ ssoEnabled: false });
    }

  }

  onClickSubmit = (values) => {
    const { username, password, rememberMe } = values;
    this.state.ssoEnabled ? this.ssoSignIn(username) : this.regularSignIn(username, password, rememberMe);
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

          <LoginForm onSubmit={this.onClickSubmit} ssoEnabled={this.state.ssoEnabled}/>
        </Panel>
      </div>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  auth
});

export default connect(mapStateToProps, { authenticate, ssoCheck })(AuthPage);

