import _ from 'lodash';
import { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { DEFAULT_REDIRECT_ROUTE } from 'src/constants';

export class RedirectAfterLogin extends Component {
  componentDidMount() {
    const { loggedIn } = this.props.auth;
    if (loggedIn) {
      this.redirect();
      return;
    }
  }

  componentWillReceiveProps(nextProps) {
    const { loggedIn } = nextProps.auth;

    if (loggedIn) {
      this.redirect(nextProps);
      return;
    }
  }

  redirect(nextProps) {
    // Passes location state through '/' or '/auth'
    // DefaultRedirect component handles protected routes
    const defaultRoute = { ...this.props.location, pathname: DEFAULT_REDIRECT_ROUTE };
    const route = _.get(nextProps, 'location.state.redirectAfterLogin', defaultRoute);
    this.props.history.push(route);
  }

  render() {
    return null;
  }

}

const mapStateToProps = ({ auth }) => ({
  auth
});

export default withRouter(connect(mapStateToProps)(RedirectAfterLogin));
