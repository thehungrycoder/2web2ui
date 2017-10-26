import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

// Actions
import { listWebhooks } from 'src/actions/webhooks';

// Components
import { Loading, TableCollection, ApiErrorBanner } from 'src/components';
import { Page } from '@sparkpost/matchbox';

const columns = ['Name', 'ID', 'Target'];
const getRowData = ({ id, name, target }) => {
  const nameLink = <Link to={`/webhooks/details/${id}`}>{name}</Link>;
  return [nameLink, id, target];
};
const filterBoxConfig = {
  show: true,
  itemToStringKeys: ['name', 'id', 'target']
};


class WebhooksList extends Component {

  componentDidMount() {
    this.props.listWebhooks();
  }

  renderError() {
    const { error, listWebhooks } = this.props;
    return (
      <ApiErrorBanner
        message={'Sorry, we seem to have had some trouble loading your webhooks.'}
        errorDetails={error.message}
        reload={listWebhooks}
      />
    );
  }

  renderCollection() {
    const { webhooks } = this.props;
    return (
      <TableCollection
        columns={columns}
        rows={webhooks}
        getRowData={getRowData}
        pagination={true}
        filterBox={filterBoxConfig}
      />
    );
  }

  render() {
    const { loading, error } = this.props;

    if (loading) {
      return <Loading />;
    }

    return (
      <div>
        <Page
          primaryAction={{ content: 'Create Webhook', Component: Link, to: '/webhooks/create' }}
          title={'Webhooks'}
        />
        {error && this.renderError()}
        {!error && this.renderCollection()}
      </div>
    );
  }
}

function mapStateToProps({ webhooks }) {
  return {
    webhooks: webhooks.list,
    loading: webhooks.listLoading,
    error: webhooks.listError
  };
}

export default withRouter(connect(mapStateToProps, { listWebhooks })(WebhooksList));
