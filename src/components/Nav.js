import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../actions/auth';

export default connect(({ auth }) => ({ auth }), { logout })((props) => {
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
        <li><a style={{ cursor: 'pointer' }} onClick={() => props.logout()}>Log out</a></li>
      </ul>
    </nav>
  );
});
