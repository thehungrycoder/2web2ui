import React from 'react';

// Components
import ProtectedRoute from 'components/ProtectedRoute';
import AuthenticationGate from 'components/AuthenticationGate';
import Typeahead from 'components/Typeahead';

// Pages
import {
  AuthPage,
  BillingPage,
  DashboardPage,
  SummaryReportPage,
  ProfilePage,
  TemplatesListPage,
  TemplatesEditPage,
  TemplatesPublishedPage,
  TemplatesCreatePage,
  webhooks
} from './pages';

import {
  BrowserRouter as Router,
  Route,
  Redirect
} from 'react-router-dom';

const ForgotPassword = () => <h1>Forgot Password</h1>;

const typeaheadItems = [
  { type: 'domain', value: 'something.com' },
  { type: 'campaign', value: 'camp-5' },
  { type: 'ip', value: '1.2.33.45' }
];

export default () => (
  <Router>
    <div>
      <AuthenticationGate />

      <Route exact path='/' render={() => <Redirect to='/auth' />} />
      <Route path='/auth' component={AuthPage} />
      <Route path='/forgot-password' component={ForgotPassword} />

      <ProtectedRoute path='/dashboard' component={DashboardPage} />
      <Route exact path='/reports' render={() => <Redirect to='/reports/summary' />} />
      <ProtectedRoute path='/reports/summary' component={SummaryReportPage} />

      <Route exact path='/typeahead' render={() => (
        <Typeahead items={typeaheadItems} onChange={(...args) => console.log(args)} /> // eslint-disable-line
      )} />

      <ProtectedRoute exact path='/templates' component={TemplatesListPage} />
      <ProtectedRoute exact path='/templates/create/' component={TemplatesCreatePage} />
      <ProtectedRoute exact path='/templates/edit/:id' component={TemplatesEditPage} />
      <ProtectedRoute exact path='/templates/edit/:id/published' component={TemplatesPublishedPage} />
      {/* <ProtectedRoute exact path='/templates/edit/:id/preview' component={TemplatesEditPage} /> */}

      <ProtectedRoute exact path='/webhooks' component={webhooks.ListPage}/>
      <ProtectedRoute exact path='/webhooks/create' component={webhooks.CreatePage}/>
      <ProtectedRoute path='/webhooks/details/:id' component={webhooks.DetailsPage}/>

      <ProtectedRoute path='/account/profile' component={ProfilePage} />
      <ProtectedRoute exact path='/account/billing' component={BillingPage}/>
    </div>
  </Router>
);
