import React from 'react';
import { connect } from 'react-redux';
import { authenticate } from 'src/actions/auth';
import { PageLink, CenteredLogo } from 'src/components';
import { Panel } from '@sparkpost/matchbox';

import config from 'src/config';
import LoginForm from './components/LoginForm';
import RedirectBeforeLogin from './components/RedirectBeforeLogin';
import RedirectAfterLogin from './components/RedirectAfterLogin';
import { TFA_ROUTE, ENABLE_TFA_AUTH_ROUTE, SSO_AUTH_ROUTE } from 'src/constants';

export class AuthPage extends React.Component {
  loginSubmit = ({ username, password, rememberMe }) => {
    this.props.authenticate(username, password, rememberMe);
  }

  render() {
    const { loggedIn, tfaEnabled, tfaRequired } = this.props;

    const hasSignup = (config.featureFlags || {}).has_signup;

    if (loggedIn) {
      return <RedirectAfterLogin />;
    }

    if (tfaEnabled) {
      return <RedirectBeforeLogin to={TFA_ROUTE} />;
    }

    if (tfaRequired) {
      return <RedirectBeforeLogin to={ENABLE_TFA_AUTH_ROUTE} />;
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
  tfaEnabled: tfa.enabled,
  tfaRequired: tfa.required
});

export default connect(mapStateToProps, { authenticate })(AuthPage);
