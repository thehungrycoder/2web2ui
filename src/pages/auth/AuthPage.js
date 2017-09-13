import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { authenticate } from 'actions/auth';
import { Layout, SparkPost } from 'components';
import { Panel, Button, TextField, Checkbox } from '@sparkpost/matchbox';

import styles from './AuthPage.module.scss';

export class AuthPage extends Component {
  state = {
    username: '',
    password: '',
    rememberMe: false
  };

  onChangeUsername = (evt) => {
    this.setState({ username: evt.target.value });
  };

  onChangePassword = (evt) => {
    this.setState({ password: evt.target.value });
  };

  onChangeRememberMe = (evt) => {
    this.setState({ rememberMe: evt.target.checked });
  };

  onClickSubmit = (evt) => {
    const { username, password, rememberMe } = this.state;
    evt.preventDefault();
    this.props.authenticate(username, password, rememberMe);
  };

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

  render() {
    const { errorDescription, loggedIn } = this.props.auth;

    if (loggedIn) {
      return <Redirect to="/dashboard" />;
    }

    return (
      <Layout.Form>
        <div className={styles.LogoWrapper}>
          <a href="https://www.sparkpost.com" title="SparkPost">
            <SparkPost.Logo />
          </a>
        </div>

        <Panel sectioned accent title="Log In">
          <form>
            {errorDescription && this.renderLoginError()}

            <TextField
              autoFocus
              id="username"
              label="Username or Email"
              placeholder="Leslie Knope"
              value={this.state.username}
              onChange={this.onChangeUsername}
            />

            <TextField
              id="password"
              label="Password"
              type="password"
              placeholder="Your Password"
              value={this.state.password}
              onChange={this.onChangePassword}
            />

            <Checkbox
              id="rememberMe"
              label="Keep me logged in"
              checked={this.state.rememberMe}
              onChange={this.onChangeRememberMe}
            />

            <Button submit primary onClick={this.onClickSubmit}>
              {this.renderLoginButtonText()}
            </Button>
          </form>
        </Panel>
      </Layout.Form>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps, { authenticate })(AuthPage);
