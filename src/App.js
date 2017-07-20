import React from 'react';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import AuthenticationGate from './components/AuthenticationGate';

// Pages
import {
  AuthPage,
  DashboardPage,
  SummaryReportPage,
  ProfilePage,
  TemplatesListPage,
  TemplatesEditPage,
  WebhooksPage
} from './pages';

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

      <ProtectedRoute exact path='/templates' component={TemplatesListPage} />
      <ProtectedRoute path='/templates/edit/:id' component={TemplatesEditPage} />

      <ProtectedRoute path='/settings/profile' component={ProfilePage} />
      <ProtectedRoute path='/settings/webhooks' component={WebhooksPage}/>
    </div>
  </Router>
);
