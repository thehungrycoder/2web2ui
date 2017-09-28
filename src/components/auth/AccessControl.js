import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import config from 'src/config';

const accept = () => true;

class AccessControl extends Component {
  render() {
    const { store, condition = accept, children, redirect } = this.props;
    const show = condition({ store, config });

    if (redirect && !show) {
      return <Redirect to={redirect} />;
    }
    return show ? children : null;
  }
}

export default connect((store) => ({ store }))(AccessControl);
