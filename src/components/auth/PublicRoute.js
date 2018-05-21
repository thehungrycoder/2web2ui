import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logout } from 'src/actions/auth';
import { Route } from 'react-router-dom';
import AccessControl from './AccessControl';
import { AUTH_ROUTE } from 'src/constants';

export class PublicRoute extends Component {
  componentDidMount () {
    const { forceLogout, logout } = this.props;

    if (forceLogout) {
      logout();
    }
  }

  render () {
    const { component: Component, condition, forceLogout, loggedIn, logout, ...routeProps } = this.props;

    if (forceLogout && loggedIn) {
      return null;
    }

    return (
      <Route {...routeProps} render={(reactRouterProps) => (
        <AccessControl condition={condition} redirect={AUTH_ROUTE} wait={false}>
          <Component {...routeProps} {...reactRouterProps} />
        </AccessControl>
      )} />
    );
  }
}

const mapStateToProps = (state) => ({
  loggedIn: state.auth.loggedIn
});

export default connect(mapStateToProps, { logout })(PublicRoute);
