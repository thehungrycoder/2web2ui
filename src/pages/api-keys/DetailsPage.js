import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Page, Panel } from '@sparkpost/matchbox';

import { deleteApiKey, getApiKey, updateApiKey, listGrants, listSubaccountGrants } from 'src/actions/api-keys';

import { hasSubaccounts } from 'src/selectors/subaccounts';
import { getFormLoading, selectApiKeyId } from 'src/selectors/api-keys';
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

  constructor(props) {
    super(props);
    this.secondaryActions = [
      { content: 'Delete', onClick: this.onToggleDelete }
    ];
  }

  componentDidMount() {
    const { subaccountId, id } = this.props;
    this.props.getApiKey({ id, subaccountId });

    if (this.props.hasSubaccounts) {
      this.props.listSubaccountGrants();
    }
  }

  handleDelete = () => {
    const { deleteApiKey, history } = this.props;

    deleteApiKey().then(() => {
      history.push('/account/api-keys');
    });
  };

  onToggleDelete = () => {
    this.setState({ showDeleteModal: !this.state.showDeleteModal });
  };

  onSubmit = (values) => {
    const { updateApiKey, history } = this.props;

    return updateApiKey(values).then((res) => {
      history.push('/account/api-keys');
    });
  };

  render() {
    const { apiKey, loading } = this.props;

    if (loading) {
      return <Loading />;
    }

    return (
      <Page
        title={apiKey.label}
        breadcrumbAction={breadcrumbAction}
        secondaryActions={this.secondaryActions}>
        <Panel>
          <Panel.Section>
            <ApiKeyForm apiKey={apiKey} onSubmit={this.onSubmit} />
          </Panel.Section>
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
    apiKey: state.apiKeys.key,
    id: selectApiKeyId(props),
    error,
    grants,
    hasSubaccounts: hasSubaccounts(state),
    loading: getFormLoading(state) || state.apiKeys.keysLoading,
    subaccountId: selectSubaccountIdFromQuery(props)
  };
};

export default withRouter(
  connect(mapStateToProps, { getApiKey, updateApiKey, listGrants, listSubaccountGrants, deleteApiKey })(ApiKeysDetailsPage)
);
