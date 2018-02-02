import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

// Actions
import { listAllWebhooks } from 'src/actions/webhooks';
import { setSubaccountQuery } from 'src/helpers/subaccounts';
import { hasSubaccounts } from 'src/selectors/subaccounts';

// Components
import { Loading, TableCollection, SubaccountTag, ApiErrorBanner } from 'src/components';
import { Page } from '@sparkpost/matchbox';

const filterBoxConfig = {
  show: true,
  itemToStringKeys: ['name', 'target']
};

export class WebhooksList extends Component {

  componentDidMount() {
    this.props.listAllWebhooks();
  }

  getColumns = () => {
    const { hasSubaccounts } = this.props;
    const columns = [{ label: 'Name', sortKey: 'name' }, 'Target'];

    if (hasSubaccounts) {
      columns.push('Events For');
    }

    return columns;
  };

  getRowData = ({ id, name, target, subaccount_id }) => {
    const { hasSubaccounts } = this.props;
    const nameLink = <Link to={`/webhooks/details/${id}${setSubaccountQuery(subaccount_id)}`}>{name}</Link>;
    const row = [nameLink, target];

    if (hasSubaccounts) {
      row.push(
        <SubaccountTag
          id={subaccount_id}
          master={subaccount_id === 0}
          receiveAll={!subaccount_id && subaccount_id !== 0}/>
      );
    }

    return row;
  };

  renderError() {
    const { error, listAllWebhooks } = this.props;
    return (
      <ApiErrorBanner
        message={'Sorry, we seem to have had some trouble loading your webhooks.'}
        errorDetails={error.message}
        reload={listAllWebhooks}
      />
    );
  }

  renderCollection() {
    const { webhooks } = this.props;
    return (
      <TableCollection
        columns={this.getColumns()}
        rows={webhooks}
        getRowData={this.getRowData}
        pagination={true}
        filterBox={filterBoxConfig}
        defaultSortColumn='name'
      />
    );
  }

  render() {
    const { loading, error, webhooks } = this.props;

    if (loading) {
      return <Loading />;
    }

    return (
      <Page
        primaryAction={{ content: 'Create Webhook', Component: Link, to: '/webhooks/create' }}
        title='Webhooks'
        empty={{
          show: !error && webhooks.length === 0,
          image: 'Setup',
          title: 'Create a Webhook',
          content: <p>Push message events directly to your own endpoints</p>
        }}>
        { error ? this.renderError() : this.renderCollection() }
      </Page>
    );
  }
}

function mapStateToProps({ webhooks, ...state }) {
  return {
    hasSubaccounts: hasSubaccounts(state),
    webhooks: webhooks.list,
    loading: webhooks.listLoading,
    error: webhooks.listError
  };
}

export default withRouter(connect(mapStateToProps, { listAllWebhooks })(WebhooksList));
