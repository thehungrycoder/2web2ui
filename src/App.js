import React from 'react';
import { connect } from 'react-redux';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import AuthenticationGate from './components/AuthenticationGate';
import Logout from './components/Logout';

// Pages
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';

import {
  BrowserRouter as Router,
  Link,
  Route,
  Redirect
} from 'react-router-dom'

const SummaryReport = () => <h1>Summary Report</h1>;
const ForgotPassword = () => <h1>Forgot Password</h1>;

const Nav = connect(({ auth }) => ({ auth }))((props) => {
  if (!props.auth.loggedIn) {
    return null;
  }
  return (
    <nav>
      <ul>
        <li><Link to='/dashboard'>Dashboard</Link></li>
        <li>
          <Link to='/reports'>Reports</Link>
          <ul>
            <li><Link to='/reports/summary'>Summary Report</Link></li>
          </ul>
        </li>
      </ul>
    </nav>
  );
})

export default () => (
  <Router>
    <div>
      <AuthenticationGate />
      
      <Route exact path='/' render={() => <Redirect to='/auth' />} />
      <Route path='/auth' component={AuthPage} />
      <Route path='/forgot-password' component={ForgotPassword} />
      <Route path='/logout' component={Logout} />
          
      <ProtectedRoute path='/' component={Nav} />
      <ProtectedRoute path='/dashboard' component={DashboardPage} />
      <Route path='/reports' render={() => <Redirect to='/reports/summary' />} />
      <ProtectedRoute path='/reports/summary' component={SummaryReport} />
    </div>
  </Router>
);
