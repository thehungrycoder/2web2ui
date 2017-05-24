import React, { Component } from 'react';
import _ from 'lodash';

// Pages
import AuthPage from './pages/AuthPage';
import { connect } from 'react-redux';
import authCookie from './helpers/authCookie';
import { logout } from './actions/auth';

import {
  BrowserRouter as Router,
  Redirect,
  Route,
  withRouter
} from 'react-router-dom'

import './App.scss';

class _Logout extends Component {
  componentDidMount() {
    this.props.logout();
    this.props.history.push('/auth');
  }
  render() {
    return null;
  }
}
const Logout = withRouter(connect(null, { logout })(_Logout));

class _ProtectedRoute extends Component {
  render() {
    const { component: Component, auth, ...rest } = this.props;
    return (
      <Route {...rest} render={(props) => (
        auth.loggedIn ? (
          <div><Component {...props} /></div>
        ) : (
          <Redirect to={{
            pathname: '/auth',
            state: { redirectAfterLogin: props.location.pathname }
          }}/>
        )
      )}/>
    );
  }
}
const ProtectedRoute = withRouter(connect(({ auth }) => ({ auth }))(_ProtectedRoute));

const Dashboard = () => <h1>Dashboard</h1>;
const SummaryReport = () => <h1>Summary Report</h1>;
const ForgotPassword = () => <h1>Forgot Password</h1>;

class _AuthenticationGate extends Component {
  
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
    return <h1><strong>You are currently:</strong> {this.props.auth.loggedIn ? 'logged in' : 'not logged in'}</h1>;
  }
}
const AuthenticationGate = withRouter(connect(({ auth }) => ({ auth }))(_AuthenticationGate));

export default () => (
  <Router>
    <div>
      <AuthenticationGate />
      
      <Route path='/auth' component={AuthPage} />
      <Route path='/forgot-password' component={ForgotPassword} />
      <Route path='/logout' component={Logout} />
          
      <ProtectedRoute path='/dashboard' component={Dashboard} />
      <ProtectedRoute path='/summary' component={SummaryReport} />
    </div>
  </Router>
);
