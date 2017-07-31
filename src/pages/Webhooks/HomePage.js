import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

// Actions
import { listWebhooks } from '../../actions/webhooks';

// Components
import Layout from '../../components/Layout/Layout';
import { Page, Table, Panel, Button, Pagination } from '@sparkpost/matchbox';

class WebhooksHome extends Component {
  state = {
    perPage: 10,
    currentPage: 0
  }

  componentDidMount () {
    this.props.listWebhooks();
  }

  renderRow (webhook) {
    const nameLink = <Link to={`/webhooks/details/${webhook.id}`}>{webhook.name}</Link>;
    return (
        <Table.Row key={webhook.id} rowData={ [nameLink, webhook.id, webhook.target]} >
        </Table.Row>
    );
  }

  renderWebhookRows (webhooks, currentPage, perPage) {
    const currentIndex = currentPage * perPage;
    return webhooks.slice(currentIndex, currentIndex + perPage).map(
      (webhook) => this.renderRow(webhook)
    );
  }

  render () {
    const { webhooks, listLoading } = this.props;

    // This should probably be a universal page-loading component
    if (listLoading && !webhooks.length) {
      return (
        <Layout.App>
          <Page
            primaryAction={{content: 'Create Webhook', onClick: () => { this.props.history.push('/webhooks/create'); }}}
            title={'Webhooks'}
          />
          <Panel>
            <Panel.Section>
              Loading...
            </Panel.Section>
          </Panel>
        </Layout.App>
      );
    }

    // TODO: fix paging error
    const webhookRows = webhooks.length ? this.renderWebhookRows(webhooks, this.state.currentPage, this.state.perPage) : null;

    return (
      <Layout.App>
        <Page
          primaryAction={{content: 'Create Webhook', onClick: () => { this.props.history.push('/webhooks/create'); }}}
          title={'Webhooks'}
        />
        <Panel>
          <Table>
            <thead>
              <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>ID</Table.HeaderCell>
                <Table.HeaderCell>Target</Table.HeaderCell>
              </Table.Row>
            </thead>
            <tbody>
              { webhookRows }
            </tbody>
          </Table>
        </Panel>
        <Pagination
           pages={Math.ceil(webhooks.length / this.state.perPage)}
           pageRange={5}
           initialIndex={0}
           onChange={(index) => { this.setState({currentPage: index}); }}
         />
        <Button.Group>
         Show:
         <Button onClick={ () => { this.setState({ perPage: 10 }); } }>10</Button>
         <Button onClick={ () => { this.setState({ perPage: 25 }); } }>25</Button>
         <Button onClick={ () => { this.setState({ perPage: 50 }); } }>50</Button>
        </Button.Group>
      </Layout.App>
    );
  }
}

function mapStateToProps ({ webhooks }) {
  return {
    webhooks: webhooks.list,
    listLoading: webhooks.listLoading
  };
}

export default withRouter(connect(mapStateToProps, { listWebhooks })(WebhooksHome));
