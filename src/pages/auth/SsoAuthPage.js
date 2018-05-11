import React, { Component } from 'react';
import { connect } from 'react-redux';
import qs from 'query-string';
import { Panel } from '@sparkpost/matchbox';
import { ssoCheck } from 'src/actions/auth';
import { PageLink } from 'src/components';

import config from 'src/config';
import { decodeBase64 } from 'src/helpers/string';
import LoginPanel from './components/LoginPanel';

export class SsoAuthPage extends Component {
  state = {
    ssoError: null
  };

  componentWillReceiveProps (nextProps) {
    const { ssoUser, username } = nextProps.auth;

    if (typeof ssoUser === 'undefined') { // we don't know if you're an ssoUser yet
      return;
    }

    if (ssoUser) {
      window.location.assign(`${config.apiBase}/users/saml/login/${username}`);
    } else {
      this.setState({ ssoError: 'User is not SSO' });

    }
  }

  loginSubmit = ({ username }) => {
    this.props.ssoCheck(username);
  }

  render () {
    const { location } = this.props;
    const search = qs.parse(location.search);
    const loginError = this.state.ssoError || decodeBase64(search.error); // SSO or submit error

    return (
      <LoginPanel title={'Single Sign-On'} ssoEnabled={true} loginError={loginError} handleSubmit={this.loginSubmit}>
        <Panel.Footer
          left={<small><PageLink to='/auth'>Not looking for single sign-on?</PageLink></small>}
        />
      </LoginPanel>
    );
  }
}

export default connect(null, { ssoCheck })(SsoAuthPage);
