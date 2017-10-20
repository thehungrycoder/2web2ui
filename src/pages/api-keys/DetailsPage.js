import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Page, Panel } from '@sparkpost/matchbox';

import { deleteApiKey, listApiKeys, updateApiKey } from 'src/actions/api-keys';
import { Loading, DeleteModal } from 'src/components';
import { getApiKey, getLoading } from 'src/selectors/api-keys';
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
    this.props.listApiKeys();
  }

  onDelete = () => {
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
      <div>
        <Page
          title={apiKey.label}
          breadcrumbAction={breadcrumbAction}
          secondaryActions={this.secondaryActions}
        />
        <Panel>
          <Panel.Section>
            <ApiKeyForm apiKey={apiKey} onSubmit={this.onSubmit} />
          </Panel.Section>
        </Panel>
        <DeleteModal
          open={this.state.showDeleteModal}
          title="Delete API Key"
          text="Are you sure you want to delete this API Key?"
          handleToggle={this.onToggleDelete}
          handleDelete={this.onDelete}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  const { error, grants, keys } = state.apiKeys;

  return {
    apiKey: getApiKey(state, props),
    keys,
    error,
    grants,
    loading: getLoading(state)
  };
};

const mapDispatchToProps = (dispatch, props) => {
  const { id } = props.match.params;

  return {
    deleteApiKey: () => dispatch(deleteApiKey(id)),
    listApiKeys: () => dispatch(listApiKeys()),
    updateApiKey: (values) => dispatch(updateApiKey(id, values))
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ApiKeysDetailsPage)
);
