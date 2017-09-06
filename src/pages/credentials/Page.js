import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Page } from '@sparkpost/matchbox';

import { fetchApiKeys } from 'actions/apiKeys';

import ApiErrorBanner from 'components/ApiErrorBanner';
import TableCollection from 'components/Collection/TableCollection';
import Layout from 'components/Layout/Layout';

const COLUMNS = ['Name', 'Key', 'Permissions'];

const getRowData = (key) => [
  key.label,
  `${key.short_key} ••••••••••••••••••••••••••••••••••••`,
  '[list of grants]'
];

class CredentialsPage extends Component {
  componentDidMount() {
    this.props.fetchApiKeys();
  }

  renderCollection() {
    const { apiKeys } = this.props;

    return (
      <TableCollection
        columns={COLUMNS}
        getRowData={getRowData}
        pagination={true}
        rows={apiKeys}
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
  apiKeys: state.apiKeys.keys,
  loading: state.apiKeys.loadingKeys,
  error: state.apiKeys.error
});

export default connect(mapStateToProps, { fetchApiKeys })(CredentialsPage);
