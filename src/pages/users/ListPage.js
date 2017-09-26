import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Page } from '@sparkpost/matchbox';

import Layout from 'src/components/layout/Layout';

export class ListPage extends Component {
  render() {
    return (
      <Layout.App>
        <Page title="Users" />
      </Layout.App>
    );
  }
}

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {})(ListPage);
