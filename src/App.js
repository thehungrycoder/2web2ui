import React from 'react';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import AuthenticationGate from './components/AuthenticationGate';
import Logout from './components/Logout';

// Pages
import AuthPage from './pages/AuthPage';

import {
  BrowserRouter as Router,
  Route,
  Redirect
} from 'react-router-dom'

import './App.scss';

const Dashboard = () => <h1>Dashboard</h1>;
const SummaryReport = () => <h1>Summary Report</h1>;
const ForgotPassword = () => <h1>Forgot Password</h1>;

export default () => (
  <Router>
    <div>
      <AuthenticationGate />
      
      <Route exact path='/' render={() => <Redirect to='/auth' />} />
      <Route path='/auth' component={AuthPage} />
      <Route path='/forgot-password' component={ForgotPassword} />
      <Route path='/logout' component={Logout} />
          
      <ProtectedRoute path='/dashboard' component={Dashboard} />
      <ProtectedRoute path='/summary' component={SummaryReport} />
    </div>
  </Router>
);
