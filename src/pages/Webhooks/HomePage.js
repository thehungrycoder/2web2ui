import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

// Actions
import { listWebhooks } from '../../actions/webhooks';

// Components
import Layout from '../../components/Layout/Layout';
import { Page, Table } from '@sparkpost/matchbox';
import WebhooksLoading from './components/WebhooksLoading';
import TableCollection from '../../components/Collection/TableCollection';

const columns = ['Name', 'ID', 'Target'];
const ListRow = ({ id, name, target }) => {
  const nameLink = <Link to={`/webhooks/details/${id}`}>{name}</Link>;
  return (
    <Table.Row key={id} rowData={ [nameLink, id, target]} />
  );
};

class WebhooksHome extends Component {

  componentDidMount() {
    this.props.listWebhooks();
  }

  render() {
    const { webhooks, listLoading, location } = this.props;

    // This should probably be a universal page-loading component
    if (listLoading && !webhooks.length) {
      return (
        <WebhooksLoading
          title={'Webhooks'}
          primaryAction={{ content: 'Create Webhook', Component: Link, to: '/webhooks/create' }}
        />
      );
    }

    return (
      <Layout.App>
        <Page
          primaryAction={{ content: 'Create Webhook', Component: Link, to: '/webhooks/create' }}
          title={'Webhooks'}
        />
        <TableCollection
          columns={columns}
          rowData={webhooks}
          rowComponent={ListRow}
          rowKeyName="id"
          pagination={true}
          defaultPerPage={25}
          location={location}
        />
      </Layout.App>
    );
  }
}

function mapStateToProps({ webhooks }) {
  return {
    webhooks: webhooks.list,
    listLoading: webhooks.listLoading
  };
}

export default withRouter(connect(mapStateToProps, { listWebhooks })(WebhooksHome));
