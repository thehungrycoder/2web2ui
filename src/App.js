import React from 'react';

// Components
import { ProtectedRoute, AuthenticationGate } from 'components';

// Pages
import {
  AuthPage,
  BillingPage,
  DashboardPage,
  ProfilePage,
  reports,
  templates,
  webhooks
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
      <Route exact path='/reports' render={() => <Redirect to='/reports/summary' />} />
      <ProtectedRoute path='/reports/summary' component={reports.SummaryPage} />

      <ProtectedRoute exact path='/templates' component={templates.ListPage} />
      <ProtectedRoute exact path='/templates/create/' component={templates.CreatePage} />
      <ProtectedRoute exact path='/templates/edit/:id' component={templates.EditPage} />
      <ProtectedRoute exact path='/templates/edit/:id/published' component={templates.PublishedPage} />
      {/* <ProtectedRoute exact path='/templates/edit/:id/preview' component={TemplatesEditPage} /> */}

      <ProtectedRoute exact path='/webhooks' component={webhooks.ListPage}/>
      <ProtectedRoute exact path='/webhooks/create' component={webhooks.CreatePage}/>
      <ProtectedRoute path='/webhooks/details/:id' component={webhooks.DetailsPage}/>

      <ProtectedRoute path='/account/profile' component={ProfilePage} />
      <ProtectedRoute exact path='/account/billing' component={BillingPage}/>
    </div>
  </Router>
);
