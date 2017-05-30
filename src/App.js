import React from 'react';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import AuthenticationGate from './components/AuthenticationGate';

// Pages
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import SummaryReportPage from './pages/SummaryReportPage';

import {
  BrowserRouter as Router,
  Route,
  Redirect
} from 'react-router-dom';

const ForgotPassword = () => <h1>Forgot Password</h1>;

export default () => (
  <Router>
    <div>
      <AuthenticationGate />

      <Route exact path='/' render={() => <Redirect to='/auth' />} />
      <Route path='/auth' component={AuthPage} />
      <Route path='/forgot-password' component={ForgotPassword} />

      <ProtectedRoute path='/dashboard' component={DashboardPage} />
      <Route path='/reports' render={() => <Redirect to='/reports/summary' />} />
      <ProtectedRoute path='/reports/summary' component={SummaryReportPage} />
    </div>
  </Router>
);
