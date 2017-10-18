import copy from 'copy-to-clipboard';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Banner, Page } from '@sparkpost/matchbox';

import { hideNewApiKey, listApiKeys } from 'src/actions/api-keys';

import { Layout, TableCollection, ApiErrorBanner } from 'src/components';
import { getLoading } from 'src/selectors/api-keys';
import { getRowData, columns, filterBoxConfig } from './tableConfig';

const primaryAction = {
  content: 'Create API Key',
  Component: Link,
  to: '/account/api-keys/create'
};

export class ListPage extends Component {
  state = { copied: false };

  componentDidMount() {
    this.props.listApiKeys();
  }

  onClickBanner = () => {
    copy(this.props.newKey);
    this.setState({ copied: true });
  };

  onReloadApiBanner = () => {
    this.props.listApiKeys({ force: true }); // force a refresh
  };

  renderBanner() {
    const { hideNewApiKey, newKey } = this.props;

    const action = {
      content: this.state.copied ? 'Copied to clipboard' : 'Copy',
      onClick: this.onClickBanner
    };

    return (
      <Banner
        action={action}
        title="New API Key"
        status="success"
        onDismiss={hideNewApiKey}
      >
        <p>Make sure to copy your API key now. You won't be able to see it again!</p>
        <strong>{newKey}</strong>
      </Banner>
    );
  }

  renderCollection() {
    const { keys } = this.props;

    return (
      <TableCollection
        columns={columns}
        getRowData={getRowData}
        pagination={true}
        rows={keys}
        filterBox={filterBoxConfig}
      />
    );
  }

  renderError() {
    return (
      <ApiErrorBanner
        errorDetails={this.props.error.message}
        message="Sorry, we seem to have had some trouble loading your API keys."
        reload={this.onReloadApiBanner}
      />
    );
  }

  render() {
    const { error, loading, newKey, count } = this.props;

    return (
      <Layout.App loading={loading}>
        <Page primaryAction={primaryAction} title="API Keys" />
        {newKey && this.renderBanner()}
        {!error && count > 0 && this.renderCollection()}
        {error && this.renderError()}
      </Layout.App>
    );
  }
}

const mapStateToProps = (state) => {
  const { error, keys, newKey } = state.apiKeys;
  return {
    count: keys.length,
    keys,
    loading: getLoading(state),
    error,
    newKey
  };
};

export default connect(mapStateToProps, { hideNewApiKey, listApiKeys })(
  ListPage
);
