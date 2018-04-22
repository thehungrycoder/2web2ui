import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Page, Panel, Banner } from '@sparkpost/matchbox';
import _ from 'lodash';

import { listApiKeys, getApiKey, listGrants } from 'src/actions/api-keys';
import { showAlert } from 'src/actions/globalAlert';

import { getFormLoading, getCurrentApiKey } from 'src/selectors/api-keys';

import { Loading } from 'src/components';
import ApiKeyForm from './components/ApiKeyForm';

const breadcrumbAction = {
  content: 'API Keys',
  Component: Link,
  to: '/account/api-keys'
};

export class ApiKeysDetailsPage extends Component {
  componentDidMount() {
    const { keys } = this.props;
    if (!keys.length) {
      this.props.listApiKeys();
    }

    this.props.listGrants();
  }

  renderReadOnlyAlert() {
    const { apiKey } = this.props;

    return (<Banner
      status='info'
    >
      <p>This API key is only editable by the owner: {apiKey.username}.</p>
    </Banner>);
  }

  renderNotFound() {
    return (<Banner
      status='warning'
    >
      <p>API Key not found.</p>
    </Banner>);
  }

  render() {
    const { apiKey, loading } = this.props;

    if (loading) {
      return <Loading />;
    }

    const isEmpty = _.isEmpty(apiKey);

    return (
      <Page
        title={apiKey.label}
        breadcrumbAction={breadcrumbAction}
      >
        {!isEmpty && this.renderReadOnlyAlert()}
        <Panel>
          {isEmpty ? this.renderNotFound() : <ApiKeyForm onSubmit={_.noop} apiKey={apiKey} isReadOnly={true}/>}
        </Panel>
      </Page>
    );
  }
}

const mapStateToProps = (state, props) => {
  const { grants } = state.apiKeys;

  return {
    apiKey: getCurrentApiKey(state, props),
    keys: state.apiKeys.keys,
    grants,
    loading: getFormLoading(state) || state.apiKeys.keysLoading
  };
};

export default connect(mapStateToProps, {
  listApiKeys,
  getApiKey,
  listGrants,
  showAlert
})(ApiKeysDetailsPage);
