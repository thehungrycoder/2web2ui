import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Page } from '@sparkpost/matchbox';

import { Loading } from 'src/components';

export class PreviewPage extends Component {
  render() {
    if (!this.props.template) {
      return <Loading />;
    }

    return (
      <Page>
      </Page>
    );
  }
}

const mapStateToProps = (state, props) => ({});
const mapDispatchToProps = {};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PreviewPage));
