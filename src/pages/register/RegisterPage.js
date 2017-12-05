import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';
import qs from 'query-string';
import ErrorTracker from 'src/helpers/errorTracker';

import { SparkPost } from 'src/components';
import { Panel, UnstyledLink } from '@sparkpost/matchbox';
import PanelLoading from 'src/components/panelLoading/PanelLoading';
import RegisterUserForm from './RegisterUserForm';
import styles from './RegisterPage.module.scss';

import { registerUser, checkInviteToken } from 'src/actions/users';

export class RegisterPage extends Component {

  onSubmit = (values) => this.props.registerUser(this.props.token, values)
    .then(() => <Redirect to='/dashboard' />)
    .catch((error) => {
      ErrorTracker.report('register-user', error);
    });

  componentDidMount() {
    this.props.checkInviteToken(this.props.token);
  }

  renderRegisterPanel() {
    const { error, loading } = this.props;

    if (loading) {
      //TODO: make the width passable as a prop
      return <PanelLoading />;
    }

    if (error) {
      return <p>This invite has expired, please ask your account administator to re-send your invitation</p>;
    }

    return <RegisterUserForm onSubmit={this.onSubmit} />;
  }

  render() {
    const { token, loggedIn } = this.props;

    if (token === undefined) {
      if (loggedIn) {
        return <Redirect to='/dashboard' />;
      } else {
        return <Redirect to='/auth' />;
      }
    }

    return (
      <div>
        <div className={styles.LogoWrapper}>
          <a href='https://www.sparkpost.com' title='SparkPost'>
            <SparkPost.Logo />
          </a>
        </div>

        <Panel sectioned accent title='Register'>
          { this.renderRegisterPanel() }
        </Panel>
        <UnstyledLink to='/auth'>Already registered?</UnstyledLink>
      </div>
    );
  }
}

function mapStateToProps({ auth, users }, props) {
  return {
    token: qs.parse(props.location.search).token,
    loggedIn: auth.loggedIn,
    error: users.inviteError,
    loading: users.loading
  };
}

export default withRouter(connect(mapStateToProps, { registerUser, checkInviteToken })(RegisterPage));
