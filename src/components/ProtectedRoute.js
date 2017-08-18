import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, withRouter } from 'react-router-dom';

export class _ProtectedRoute extends Component {
  render() {
    const { component: Component, auth, ...rest } = this.props;
    return (
      <Route {...rest} render={(props) => (
        auth.loggedIn ? (
          <div><Component {...props} /></div>
        ) : (
          <Redirect to={{
            pathname: '/auth',
            state: { redirectAfterLogin: props.location.pathname }
          }}/>
        )
      )}/>
    );
  }
}

export default withRouter(connect(({ auth }) => ({ auth }))(_ProtectedRoute));
