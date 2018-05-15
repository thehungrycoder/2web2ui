import React, { Component } from 'react';
import { connect } from 'react-redux';
import qs from 'query-string';
import { Panel } from '@sparkpost/matchbox';
import { ssoCheck } from 'src/actions/auth';
import { PageLink } from 'src/components';

import config from 'src/config';
import { decodeBase64 } from 'src/helpers/string';
import LoginPanel from './components/LoginPanel';
import { AUTH_ROUTE } from 'src/constants';

export class SsoAuthPage extends Component {
  state = {
    submitted: false
  };

  loginSubmit = ({ username }) => {
    this.setState({ submitted: true });
    this.props.ssoCheck(username);
  }

  componentWillReceiveProps (nextProps) {
    const { ssoUser, username } = nextProps.auth;

    if (ssoUser) {
      window.location.assign(`${config.apiBase}/users/saml/login/${username}`);
    }
  }

  render () {
    const { location, auth } = this.props;
    const { ssoUser } = auth;
    const { submitted } = this.state;
    const search = qs.parse(location.search);
    const loginError = (submitted && ssoUser === false) ? 'User is not set up to use single sign-on' : decodeBase64(search.error); // error comes base 64 encoded in url on redirect from 3rd party

    return (
      <LoginPanel title={'Single Sign-On'} ssoEnabled loginError={loginError} handleSubmit={this.loginSubmit}>
        <Panel.Footer
          left={<small><PageLink to={AUTH_ROUTE}>Not looking for single sign-on?</PageLink></small>}
        />
      </LoginPanel>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  auth
});

export default connect(mapStateToProps, { ssoCheck })(SsoAuthPage);
