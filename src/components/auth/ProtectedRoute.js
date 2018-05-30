import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { AccessControl } from 'src/components/auth';
import ErrorBoundary from 'src/components/errorBoundaries/ErrorBoundary';
import _ from 'lodash';
import { AUTH_ROUTE } from 'src/constants';

export class ProtectedRoute extends Component {

  renderComponent (reactRouterProps) {
    const { component: Component, condition } = this.props;

    return (
      <AccessControl condition={condition} redirect='/404'>
        <Component {...reactRouterProps} />
      </AccessControl>
    );
  }

  renderRoute = (reactRouterProps) => {
    const { auth, location } = this.props;
    const state = {};

    // never store logout page as a post login redirect
    if (location.pathname !== '/logout') {
      state.redirectAfterLogin = location;
    }

    return auth.loggedIn
      ? this.renderComponent(reactRouterProps)
      : <Redirect to={{ pathname: AUTH_ROUTE, state }} />;
  }

  render () {
    // can't pass component prop to Route below or it confuses RR
    const protectedRouteProps = _.omit(this.props, ['component', 'auth', 'condition']);
    return (<ErrorBoundary>
      <Route {...protectedRouteProps} render={this.renderRoute} />
    </ErrorBoundary>);
  }
}

const mapStateToProps = ({ auth, account }) => ({
  auth,
  accountStatus: account.status
});
export default connect(mapStateToProps, {})(ProtectedRoute);
