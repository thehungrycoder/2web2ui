import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Page } from '@sparkpost/matchbox';
import { listApiKeys, hideNewApiKey } from 'src/actions/api-keys';
import { selectKeysForAccount } from 'src/selectors/api-keys';
import { Loading, SubaccountTag, TableCollection, ApiErrorBanner, ApiKeySuccessBanner, ShortKeyCode } from 'src/components';
import { filterBoxConfig } from './tableConfig';
import { hasSubaccounts } from 'src/selectors/subaccounts';
import { setSubaccountQuery } from 'src/helpers/subaccounts';
import { LINKS } from 'src/constants';

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

  getLabel = ({ id, subaccount_id, label }) => <Link to={`/account/api-keys/details/${id}${setSubaccountQuery(subaccount_id)}`}>{label}</Link>

  getRowData = (key) => {
    const { short_key, subaccount_id } = key;
    const { hasSubaccounts } = this.props;
    const rowData = [
      this.getLabel(key),
      <ShortKeyCode shortKey={short_key} />
    ];

    if (hasSubaccounts) {
      rowData.push(<SubaccountTag id={subaccount_id} />);
    }

    return rowData;
  };

  getColumns = () => {
    const { hasSubaccounts } = this.props;
    const columns = [
      { label: 'Name', width: '40%', sortKey: 'label' },
      { label: 'Key' }
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
    const { error, loading, newKey, keys } = this.props;

    if (loading) {
      return <Loading />;
    }

    return (
      <Page primaryAction={primaryAction} title='API Keys' empty={{
        show: keys.length === 0,
        image: 'Setup',
        content: <p>Create an API key you can use to access our REST or SMTP API services.</p>,
        secondaryAction: {
          content: 'View our API Docs',
          external: true,
          to: LINKS.API_DOCS
        }}}>
        { newKey && this.renderBanner() }
        { error ? this.renderError() : this.renderCollection() }
      </Page>
    );
  }
}

const mapStateToProps = (state) => {
  const { error, newKey, keysLoading } = state.apiKeys;
  return {
    hasSubaccounts: hasSubaccounts(state),
    keys: selectKeysForAccount(state),
    error,
    newKey,
    loading: keysLoading
  };
};

export default connect(mapStateToProps, { listApiKeys, hideNewApiKey })(ListPage);
