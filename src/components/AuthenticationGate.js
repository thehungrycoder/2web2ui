import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import authCookie from '../helpers/authCookie';

export class _AuthenticationGate extends Component {
  
  componentWillMount() {
    const { auth, dispatch } = this.props;
    if (auth.loggedIn && auth.access_token) {
      return;
    }
        
    const foundCookie = authCookie.get();
    if (foundCookie) {
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: foundCookie
      });
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
    return <p className="small text-muted text-center">You are currently: <strong>{this.props.auth.loggedIn ? 'logged in' : 'not logged in'}</strong></p>;
  }
}

export default withRouter(connect(({ auth }) => ({ auth }))(_AuthenticationGate));