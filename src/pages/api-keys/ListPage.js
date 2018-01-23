import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Page } from '@sparkpost/matchbox';
import { listApiKeys, hideNewApiKey } from 'src/actions/api-keys';
import { Loading, SubaccountTag, TableCollection, ApiErrorBanner, ApiKeySuccessBanner } from 'src/components';
import { filterBoxConfig } from './tableConfig';
import { hasSubaccounts } from 'src/selectors/subaccounts';
import { setSubaccountQuery } from 'src/helpers/subaccounts';

const primaryAction = {
  content: 'Create API Key',
  Component: Link,
  to: '/account/api-keys/create'
};


export class ListPage extends Component {
  state = { copied: false };

  // only want to show the new key after a create
  componentWillUnmount() {
    this.props.hideNewApiKey();
  }

  componentDidMount() {
    this.props.listApiKeys();
  }

    getRowData = ({ id, label, short_key, subaccount_id }) => {
      const { hasSubaccounts } = this.props;
      const rowData = [
        <Link to={`/account/api-keys/details/${id}${setSubaccountQuery(subaccount_id)}`}>{label}</Link>,
        <code>{short_key}••••••••</code>
      ];

      const subaccountTag = (hasSubaccounts && subaccount_id)
        ? <SubaccountTag id={subaccount_id} />
        : null;

      rowData.push(subaccountTag);

      return rowData;
    };

  getColumns = () => {
    const { hasSubaccounts } = this.props;
    const columns = [
      { label: 'Name', width: '40%', sortKey: 'label' },
      { label: 'Key', width: '20%' }
    ];

    if (hasSubaccounts) {
      columns.push({ label: 'Subaccount', width: '20%', sortKey: 'subaccount_id' });
    }

    return columns;
  }

  onReloadApiBanner = () => {
    this.props.listApiKeys();
  };

  renderBanner() {
    return (
      <ApiKeySuccessBanner
        title="New API Key"
      />
    );
  }

  renderCollection() {
    const { keys } = this.props;

    return (
      <TableCollection
        columns={this.getColumns()}
        getRowData={this.getRowData}
        pagination={true}
        rows={keys}
        filterBox={filterBoxConfig}
        defaultSortColumn='label'
        defaultSortDirection='desc'
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

    if (loading) {
      return <Loading />;
    }

    return (
      <Page primaryAction={primaryAction} title='API Keys' empty={{
        show: count === 0,
        image: 'Setup',
        content: <p>Create an API key you can use to access our REST or SMTP API services.</p>,
        secondaryAction: {
          content: 'View our API Docs',
          external: true,
          to: 'https://developers.sparkpost.com/api'
        }}}>
        { newKey && this.renderBanner() }
        { error ? this.renderError() : this.renderCollection() }
      </Page>
    );
  }
}

const mapStateToProps = (state) => {
  const { error, keys, newKey, keysLoading } = state.apiKeys;
  return {
    count: keys.length,
    hasSubaccounts: hasSubaccounts(state),
    keys,
    error,
    newKey,
    loading: keysLoading
  };
};

export default connect(mapStateToProps, { listApiKeys, hideNewApiKey })(ListPage);
