import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Page } from '@sparkpost/matchbox';

export class CreatePage extends Component {
  render() {
    return (
      <Page title="Create Suppression List">
        Hi
      </Page>
    );
  }
}

const mapStateToProps = (state) => ({});
export default connect(mapStateToProps, {})(CreatePage);
