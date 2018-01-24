import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { AccessControl } from 'src/components/auth';
import _ from 'lodash';
import config from 'src/config';

export class ProtectedRoute extends Component {

  renderComponent(propsFromRoute) {
    const { component: Component, condition } = this.props;

    return (
      <AccessControl condition={condition} redirect={config.splashPage}>
        <Component {...propsFromRoute} />
      </AccessControl>
    );
  }

  renderRoute = () => {
    const { auth } = this.props;

    return auth.loggedIn
      ? this.renderComponent(this.props)
      : (
        <Redirect to={{
          pathname: '/auth',
          state: { redirectAfterLogin: this.props.location.pathname }
        }}/>
      );
  }

  render() {
    // can't pass component prop to Route below or it confuses RR
    const routeProps = _.omit(this.props, ['component', 'auth', 'condition']);
    return (<Route {...routeProps} render={this.renderRoute} />);
  }
}

const mapStateToProps = ({ auth }) => ({
  auth
});
export default connect(mapStateToProps)(ProtectedRoute);
