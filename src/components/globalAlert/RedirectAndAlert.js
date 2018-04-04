import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { showAlert } from 'src/actions/globalAlert';

export class RedirectAndAlert extends Component {
  componentDidMount() {
    this.props.showAlert(this.props.alert);
  }

  render() {
    return <Redirect to={this.props.to} />;
  }
}

export default connect(undefined, { showAlert })(RedirectAndAlert);
