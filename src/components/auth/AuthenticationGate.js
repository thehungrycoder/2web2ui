import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import authCookie from 'src/helpers/authCookie';
import { login } from 'src/actions/auth';
import { getGrantsFromCookie } from 'src/actions/currentUser';
import config from 'src/config';

export class AuthenticationGate extends Component {
  componentWillMount() {
    const { auth } = this.props;
    if (auth.loggedIn && auth.token) {
      return;
    }

    const foundCookie = authCookie.get();
    if (foundCookie) {
      this.props.login({ authData: foundCookie });
      this.props.getGrantsFromCookie(foundCookie);
    }
  }

  componentDidUpdate(oldProps) {
    const { auth, history, location = {}} = this.props;
    const redirectPath = _.get(location, 'state.redirectAfterLogin');

    // if logging in via the form
    if (location.pathname === '/auth' && !oldProps.auth.loggedIn && auth.loggedIn) {
      history.push(redirectPath || config.splashPage);
    }

    // if logging out
    if (location.pathname !== '/auth' && oldProps.auth.loggedIn && !auth.loggedIn) {
      history.push('/auth');
    }
  }

  render() {
    return null;
  }
}

export default withRouter(connect(({ auth }) => ({ auth }), { login, getGrantsFromCookie })(AuthenticationGate));
