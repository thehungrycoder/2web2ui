import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { authenticate } from 'src/actions/auth';
import { PageLink, CenteredLogo } from 'src/components';
import { Panel } from '@sparkpost/matchbox';

import config from 'src/config';
import LoginForm from './components/LoginForm';
import RedirectAfterLogin from './components/RedirectAfterLogin';
import { TFA_ROUTE, SSO_AUTH_ROUTE } from 'src/constants';

export class AuthPage extends React.Component {
  loginSubmit = ({ username, password, rememberMe }) => {
    this.props.authenticate(username, password, rememberMe);
  }

  render() {
    const { loggedIn, tfaEnabled } = this.props;

    const hasSignup = (config.featureFlags || {}).has_signup;

    if (loggedIn) {
      return <RedirectAfterLogin />;
    }

    if (tfaEnabled) {
      return <Redirect to={TFA_ROUTE} />;
    }

    return <React.Fragment>
      <CenteredLogo />
      <Panel sectioned accent title='Log In'>
        <LoginForm onSubmit={this.loginSubmit} />
      </Panel>
      <Panel.Footer
        left={hasSignup && <div><small>Don't have an account? <PageLink to="/join">Sign up</PageLink>.</small><br /></div>}
        right={<small><PageLink to={SSO_AUTH_ROUTE}>Single Sign-On</PageLink></small>}
      />
    </React.Fragment>;
  }
}

const mapStateToProps = ({ auth, tfa }) => ({
  loggedIn: auth.loggedIn,
  tfaEnabled: tfa.enabled
});

export default connect(mapStateToProps, { authenticate })(AuthPage);
