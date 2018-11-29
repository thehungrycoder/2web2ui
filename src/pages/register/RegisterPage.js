import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';
import qs from 'query-string';
import ErrorTracker from 'src/helpers/errorTracker';

import { CenteredLogo, PageLink } from 'src/components';
import { Panel } from '@sparkpost/matchbox';
import PanelLoading from 'src/components/panelLoading/PanelLoading';
import RegisterUserForm from './RegisterUserForm';

import { registerUser, checkInviteToken } from 'src/actions/users';
import { authenticate } from 'src/actions/auth';
import { ENABLE_TFA_AUTH_ROUTE, DEFAULT_REDIRECT_ROUTE, AUTH_ROUTE } from 'src/constants';

export class RegisterPage extends Component {

  onSubmit = (values) => {
    const { username, password } = values;
    const { token, registerUser } = this.props;
    return registerUser(token, values)
      .then(() => this.authAndRedirect(username, password))
      .catch((error) => ErrorTracker.report('register-user', error));
  }

  authAndRedirect = (username, password) => {
    const { authenticate, history } = this.props;
    return authenticate(username, password)
      .then((authResult) => {
        if (authResult.tfaRequired) {
          return history.push(ENABLE_TFA_AUTH_ROUTE);
        }
        return history.push(DEFAULT_REDIRECT_ROUTE);
      })
      .catch((error) => {
        // user was created but auth failed, redirect to /auth
        history.push(AUTH_ROUTE);
        ErrorTracker.report('sign-in', error);
      });
  }

  componentDidMount() {
    this.props.checkInviteToken(this.props.token);
  }

  renderRegisterPanel() {
    const { invite, loading } = this.props;

    if (loading) {
      return <PanelLoading />;
    }

    if (invite.error) {
      return (
        <Panel.Section>
          <p>This invite has expired, please ask your account administrator to re-send your invitation</p>
        </Panel.Section>
      );
    }

    return (
      <Panel.Section>
        <p><small>{invite.from} invited you to join their SparkPost account.</small></p>
        <RegisterUserForm onSubmit={this.onSubmit} email={invite.email} />
      </Panel.Section>
    );
  }

  render() {
    const { token } = this.props;

    if (token === undefined) {
      return <Redirect to={AUTH_ROUTE} />;
    }

    return (
      <div>
        <CenteredLogo />

        <Panel accent title='Set Password'>
          {this.renderRegisterPanel()}
        </Panel>
        <Panel.Footer left={<small><PageLink to="/auth">Already signed up?</PageLink></small>} />
      </div>
    );
  }
}

function mapStateToProps({ auth, users }, props) {
  return {
    token: qs.parse(props.location.search).token,
    invite: users.invite,
    loading: users.loading || auth.loginPending
  };
}

export default withRouter(connect(mapStateToProps, { registerUser, checkInviteToken, authenticate })(RegisterPage));
