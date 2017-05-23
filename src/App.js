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

import axios from 'axios';

import './App.scss';

class _ProtectedRoute extends Component {
  render() {
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
const ProtectedRoute = connect(({ auth }) => ({ auth }))(_ProtectedRoute);

const Dashboard = () => <h1>Dashboard</h1>;
const SummaryReport = () => <h1>Summary Report</h1>;

class _AuthenticationContainer extends Component {
  
  componentWillMount() {
    const { auth, dispatch } = this.props;
    if (auth.loggedIn) {
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
    
    console.log('what', location.pathname, newProps.location.pathname, redirectPath);
    console.log('receiving props', this.props, newProps);
    
    // if logging in with redirect
    if (!auth.loggedIn && newProps.auth.loggedIn && redirectPath) {
      console.log('log in', redirectPath);
      history.push(redirectPath);
    }
    
    // if logging out
    if (auth.loggedIn && !newProps.auth.loggedIn) {
      console.log('log out');
      history.push('/auth');
    }
  }
  
  render() {
    return <div className="app-container">{this.props.children}</div>;
  }
}
const AuthenticationContainer = withRouter(connect(({ auth }) => ({ auth }))(_AuthenticationContainer));

export default () => (
  <Router>
    <AuthenticationContainer>
      <Route path="/auth" component={AuthPage} />
      
      <ProtectedRoute path="/dashboard" component={Dashboard} />
      <ProtectedRoute path="/summary" component={SummaryReport} />
      <Route path="/logout" component={Logout} />
    </AuthenticationContainer>
  </Router>
);
