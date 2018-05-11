import React, { Component } from 'react';
import { connect } from 'react-redux';
import { authenticate } from 'src/actions/auth';
import { PageLink } from 'src/components';
import { Panel } from '@sparkpost/matchbox';

import config from 'src/config';
import LoginPanel from './components/LoginPanel';
import { SSO_AUTH_ROUTE } from 'src/constants';

export class AuthPage extends Component {
  loginSubmit = ({ username, password, rememberMe }) => {
    this.props.authenticate(username, password, rememberMe);
  }

  render () {
    const { auth } = this.props;
    const hasSignup = (config.featureFlags || {}).has_signup;

    return (
      <LoginPanel title={'Log In'} ssoEnabled={false} loginError={auth.errorDescription} handleSubmit={this.loginSubmit}>
        <Panel.Footer
          left={hasSignup && <div><small>Don't have an account? <PageLink to="/join">Sign up</PageLink>.</small><br /></div>}
          right={<small><PageLink to={SSO_AUTH_ROUTE}>Single Sign-On</PageLink></small>}
        />
      </LoginPanel>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  auth
});

export default connect(mapStateToProps, { authenticate })(AuthPage);
