import { Component } from 'react';
import { connect } from 'react-redux';
import { logout } from 'src/actions/auth';

export class LogoutPage extends Component {
  componentDidMount() {
    if (this.props.auth.loggedIn) {
      this.props.logout();
    }
  }

  render() {
    return null;
  }
}

export default connect(({ auth }) => ({ auth }), { logout })(LogoutPage);
