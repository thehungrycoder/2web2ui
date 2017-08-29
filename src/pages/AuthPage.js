import React, { Component } from 'react';
import { connect } from 'react-redux';
import { authenticate } from '../actions/auth';
import { Redirect } from 'react-router-dom';

import Layout from '../components/Layout/Layout';
import SparkPost from '../components/SparkPost/SparkPost';
import { Panel, Button, TextField } from '@sparkpost/matchbox';

class AuthPage extends Component {
  state = {
    username: '',
    password: '',
    remember_me: false
  }

  updateInput(name, value) {
    this.setState({
      [name]: value
    });
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
        <a href="https://www.sparkpost.com" title="SparkPost">
          <SparkPost.Logo />
        </a>

        <Panel sectioned accent>

            <h3 className="margin-bottom-xl" id="sp-login-message"><span>Log In</span></h3>
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

              <div className="checkbox small">
                <label><input name="remember_me" type="checkbox"
                checked={this.state.remember_me} onChange={(e) => this.updateInput('remember_me', e.target.checked)} /> Keep me logged in</label>
              </div>

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
