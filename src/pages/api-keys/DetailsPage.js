import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { Page, Panel, Banner } from '@sparkpost/matchbox';

import { listApiKeys, deleteApiKey, getApiKey, updateApiKey, listGrants, listSubaccountGrants } from 'src/actions/api-keys';
import { showAlert } from 'src/actions/globalAlert';

import { hasSubaccounts } from 'src/selectors/subaccounts';
import { getFormLoading, selectApiKeyId, getCurrentAPIKey, selectKeysForAccount, isFormReadyOnly } from 'src/selectors/api-keys';
import { selectSubaccountIdFromQuery } from 'src/selectors/subaccounts';

import { Loading, DeleteModal } from 'src/components';
import ApiKeyForm from './components/ApiKeyForm';

const breadcrumbAction = {
  content: 'API Keys',
  Component: Link,
  to: '/account/api-keys'
};

export class ApiKeysDetailsPage extends Component {
  static defaultProps = {
    apiKey: {}
  };

  state = {
    showDeleteModal: false
  };

  componentDidMount() {
    const { keys } = this.props;
    if (!keys.length) {
      this.props.listApiKeys();
    }

    this.props.listGrants();
    if (this.props.hasSubaccounts) {
      this.props.listSubaccountGrants();
    }
  }

  handleDelete = () => {
    const { deleteApiKey, history, subaccount, id, showAlert } = this.props;

    return deleteApiKey({ id, subaccount }).then(() => {
      history.push('/account/api-keys');
      return showAlert({ type: 'success', message: 'API key deleted' });
    });
  };

  onToggleDelete = () => {
    this.setState({ showDeleteModal: !this.state.showDeleteModal });
  };

  onSubmit = (values) => {
    const { id, showAlert, updateApiKey } = this.props;

    return updateApiKey({ id, ...values }).then(() => showAlert({
      type: 'success',
      message: 'API key updated'
    }));
  };

  renderReadOnlyAlert() {
    return (<Banner
      status='info'
    >
      <p>API keys are only editable by their owner.</p>
    </Banner>);
  }

  render() {
    const { apiKey, error, loading, isReadOnly } = this.props;

    if (loading) {
      return <Loading />;
    }

    if (error) {
      return <Redirect to='/account/api-keys' />;
    }

    const secondarActions = isReadOnly ? [] : [{ content: 'Delete', onClick: this.onToggleDelete }];

    return (
      <Page
        title={apiKey.label}
        breadcrumbAction={breadcrumbAction}
        secondaryActions={secondarActions}>
        {isReadOnly && this.renderReadOnlyAlert()}
        <Panel>
          <ApiKeyForm apiKey={apiKey} onSubmit={this.onSubmit} isReadOnly={isReadOnly} />
        </Panel>
        <DeleteModal
          open={this.state.showDeleteModal}
          title="Are you sure you want to delete this key?"
          content={<p>The key will be immediately and permanently removed. This cannot be undone.</p>}
          onCancel={this.onToggleDelete}
          onDelete={this.handleDelete}
        />
      </Page>
    );
  }
}

const mapStateToProps = (state, props) => {
  const { error, grants } = state.apiKeys;

  return {
    apiKey: getCurrentAPIKey(state, props),
    id: selectApiKeyId(state, props),
    keys: selectKeysForAccount(state),
    error,
    grants,
    hasSubaccounts: hasSubaccounts(state),
    loading: getFormLoading(state) || state.apiKeys.keyLoading,
    subaccount: selectSubaccountIdFromQuery(state, props),
    isReadOnly: isFormReadyOnly(state, props)
  };
};

export default connect(mapStateToProps, { listApiKeys, getApiKey, updateApiKey, listGrants, listSubaccountGrants, deleteApiKey, showAlert })(ApiKeysDetailsPage);
