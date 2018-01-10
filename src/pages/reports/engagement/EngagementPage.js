import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Page } from '@sparkpost/matchbox';

export class EngagementPage extends Component {
  render() {
    return (
      <Page title='Engagement Report' />
    );
  }
}

const mapStateToProps = (state, props) => ({});
const mapDispatchToProps = {};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EngagementPage));
