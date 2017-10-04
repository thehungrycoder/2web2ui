import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { AccessControl } from 'src/components/auth';

export class ProtectedRoute extends Component {

  renderComponent(propsFromRoute) {
    const { component: Component, grants = [], condition } = this.props;

    if (grants.length === 0) {
      // TODO: make this render the loading page somehow??
      return null;
    }

    return (
      <AccessControl condition={condition} redirect='/dashboard'>
        <Component {...propsFromRoute} />
      </AccessControl>
    );
  }

  render() {
    const { component, auth, condition, ...rest } = this.props;
    return (
      <Route {...rest} render={(props) => (
        auth.loggedIn ? this.renderComponent(props) : (
          <Redirect to={{
            pathname: '/auth',
            state: { redirectAfterLogin: props.location.pathname }
          }}/>
        )
      )}/>
    );
  }
}

const mapStateToProps = ({ auth, currentUser = {}}) => ({
  auth,
  grants: currentUser.grants || []
});
export default connect(mapStateToProps)(ProtectedRoute);
