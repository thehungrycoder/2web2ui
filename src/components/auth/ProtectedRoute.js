import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { AccessControl } from 'src/components/auth';
import { showSuspensionAlert } from 'src/actions/globalAlert';
import _ from 'lodash';

export class ProtectedRoute extends Component {

  componentDidUpdate(prevProps) {
    if (prevProps.accountStatus !== 'suspended' && this.props.accountStatus === 'suspended') {
      this.props.showSuspensionAlert({ autoDismiss: false });
    }
  }

  renderComponent(reactRouterProps) {
    const { component: Component, condition } = this.props;

    return (
      <AccessControl condition={condition} redirect='/404'>
        <Component {...reactRouterProps} />
      </AccessControl>
    );
  }

  renderRoute = (reactRouterProps) => {
    const { auth } = this.props;

    return auth.loggedIn
      ? this.renderComponent(reactRouterProps)
      : (
        <Redirect to={{
          pathname: '/auth',
          state: { redirectAfterLogin: this.props.location.pathname }
        }}/>
      );
  }

  render() {
    // can't pass component prop to Route below or it confuses RR
    const protectedRouteProps = _.omit(this.props, ['component', 'auth', 'condition']);
    return (<Route {...protectedRouteProps} render={this.renderRoute} />);
  }
}

const mapStateToProps = ({ auth, account }) => ({
  auth,
  accountStatus: account.status
});
export default connect(mapStateToProps, { showSuspensionAlert })(ProtectedRoute);
