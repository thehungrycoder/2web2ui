import { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { logout } from '../actions/auth';

export class _Logout extends Component {
  componentWillMount() {
    this.props.logout();
    this.props.history.push('/auth');
  }
  render() {
    return null;
  }
}

export default withRouter(connect(null, { logout })(_Logout));