import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Page } from '@sparkpost/matchbox';

import { fetchApiKeys } from 'src/actions/credentials';

import ApiErrorBanner from 'src/components/apiErrorBanner/ApiErrorBanner';
import TableCollection from 'src/components/collection/TableCollection';
import Layout from 'src/components/layout/Layout';
import PermissionsColumn from './components/PermissionsColumn';

const COLUMNS = ['Name', 'Key', 'Permissions'];

const getRowData = (key) => [
  key.label,
  <code>
    {key.short_key} ••••
  </code>,
  <PermissionsColumn grants={key.grants} />
];

export class ListPage extends Component {
  componentDidMount() {
    this.props.fetchApiKeys();
  }

  renderCollection() {
    const { keys } = this.props;

    return (
      <TableCollection
        columns={COLUMNS}
        getRowData={getRowData}
        pagination={true}
        rows={keys}
      />
    );
  }

  renderError() {
    const { error, fetchApiKeys } = this.props;

    return (
      <ApiErrorBanner
        errorDetails={error.message}
        message="Sorry, we seem to have had some trouble loading your API keys."
        reload={fetchApiKeys}
      />
    );
  }

  render() {
    const { error, loading } = this.props;

    return (
      <Layout.App loading={loading}>
        <Page title="API Keys" />
        {error ? this.renderError() : this.renderCollection()}
      </Layout.App>
    );
  }
}

const mapStateToProps = (state) => ({
  error: state.credentials.error,
  keys: state.credentials.keys,
  loading: state.credentials.loadingKeys
});

export default connect(mapStateToProps, { fetchApiKeys })(ListPage);
