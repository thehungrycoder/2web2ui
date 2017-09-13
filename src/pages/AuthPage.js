import React, { Component } from 'react';
import { connect } from 'react-redux';
import { authenticate } from '../actions/auth';
import { Redirect } from 'react-router-dom';

import { Layout, SparkPost } from 'components';
import { Panel, Button, TextField, Checkbox } from '@sparkpost/matchbox';

import styles from './AuthPage.module.scss';

class AuthPage extends Component {
  state = {
    username: '',
    password: '',
    remember_me: false
  }

  updateInput(name, value) {
    this.setState({ [name]: value });
  }

  renderLoginError() {
    const { errorDescription } = this.props.auth;

    if (!errorDescription) {
      return null;
    }

    return (
      <div className='error'>
        <p>{errorDescription}</p>
      </div>
    );
  }

  renderLoginButton() {
    return this.props.auth.loginPending ? <span><i className="fa fa-spinner fa-spin"></i> Logging In</span> : <span>Log In</span>;
  }

  render() {
    if (this.props.auth.loggedIn) {
      return <Redirect to='/dashboard' />;
    }
    return (
      <Layout.Form>
        <div className={styles.LogoWrapper}>
          <a href="https://www.sparkpost.com" title="SparkPost"><SparkPost.Logo /></a>
        </div>

        <Panel sectioned accent title='Log In'>
            <form>
              {this.renderLoginError()}

              <TextField
                autoFocus
                id='username'
                label='Username or Email'
                placeholder='Leslie Knope'
                value={this.state.username}
                onChange={ (e) => this.updateInput('username', e.target.value) }
              />

              <TextField
                id='password'
                label='Password'
                type='password'
                placeholder='Your Password'
                value={this.state.password}
                onChange={ (e) => this.updateInput('password', e.target.value) }
              />

              <Checkbox
                id='remember_me'
                label='Keep me logged in'
                checked={this.state.remember_me}
                onChange={(e) => this.updateInput('remember_me', e.target.checked)}
              />

              <Button
                submit
                primary
                onClick={(e) => {
                  const { username, password, remember_me } = this.state;
                  e.preventDefault();
                  this.props.authenticate(username, password, remember_me);
                }}
                >{ this.renderLoginButton() }</Button>

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
