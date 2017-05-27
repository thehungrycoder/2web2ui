import React from 'react';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import AuthenticationGate from './components/AuthenticationGate';
import Nav from './components/Nav';

// Pages
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';

import {
  BrowserRouter as Router,
  Route,
  Redirect
} from 'react-router-dom';

const SummaryReport = () => <h1>Summary Report</h1>;
const ForgotPassword = () => <h1>Forgot Password</h1>;

export default () => (
  <Router>
    <div>
      <AuthenticationGate />

      <Route exact path='/' render={() => <Redirect to='/auth' />} />
      <Route path='/auth' component={AuthPage} />
      <Route path='/forgot-password' component={ForgotPassword} />

      <ProtectedRoute path='/' component={Nav} />
      <ProtectedRoute path='/dashboard' component={DashboardPage} />
      <Route path='/reports' render={() => <Redirect to='/reports/summary' />} />
      <ProtectedRoute path='/reports/summary' component={SummaryReport} />
    </div>
  </Router>
);
