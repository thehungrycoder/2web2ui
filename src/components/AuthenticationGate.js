import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import _ from 'lodash';
import authCookie from '../helpers/authCookie';
import { login } from '../actions/auth';

export class _AuthenticationGate extends Component {
  
  componentWillMount() {
    const { auth } = this.props;
    if (auth.loggedIn && auth.token) {
      return;
    }
        
    const foundCookie = authCookie.get();
    if (foundCookie) {
      this.props.login(foundCookie);
    }
  }
  
  componentWillUpdate(newProps) {    
    const { auth, history, location = {} } = this.props;
    let redirectPath = _.get(location, 'state.redirectAfterLogin');
    
    if (location.pathname === '/auth' && newProps.location.pathname === '/auth' && !redirectPath) {
      redirectPath = '/dashboard';
    }
  
    // if logging in
    if (!auth.loggedIn && newProps.auth.loggedIn && redirectPath) {
      history.push(redirectPath);
    }
  }
  
  render() {
    const { loggedIn } = this.props.auth
    return (
      <div className="small text-center">
        <p className="text-muted">You are currently: <strong>{loggedIn ? 'logged in' : 'not logged in'}</strong></p>
        {loggedIn && <Link to='/logout'>Log out</Link>}
      </div>
    );
  }
}

export default withRouter(connect(({ auth }) => ({ auth }), { login })(_AuthenticationGate));