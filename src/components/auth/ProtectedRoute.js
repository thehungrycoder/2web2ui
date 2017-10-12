import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { AccessControl } from 'src/components/auth';
import _ from 'lodash';

export class ProtectedRoute extends Component {

  renderComponent(propsFromRoute) {
    const { component: Component, condition } = this.props;

    return (
      <AccessControl condition={condition} redirect='/dashboard'>
        <Component {...propsFromRoute} />
      </AccessControl>
    );
  }

  render() {
    const { auth } = this.props;
    // can't pass component prop to Route below or it confuses RR
    const routeProps = _.omit(this.props, ['component', 'auth', 'condition']);
    return (
      <Route {...routeProps} render={(props) => (
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

const mapStateToProps = ({ auth }) => ({
  auth
});
export default connect(mapStateToProps)(ProtectedRoute);
