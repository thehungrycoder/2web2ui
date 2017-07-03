import React, { Component } from 'react';
import { connect } from 'react-redux';

// Actions
import { listWebhooks } from '../../actions/webhooks';

// Components
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import { Table, Panel, Button, Pagination } from '@sparkpost/matchbox';

class WebhooksPage extends Component {
  state = {
    perPage: 10,
    currentPage: 0
  }

  componentDidMount () {
    this.props.listWebhooks();
  }

  viewDetail () {
    console.log('viewing details');
  }

  renderRow (webhook) {
    const nameLink = <Link to="/dashboard">{webhook.name}</Link>;
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
    const webhookCount = this.props.webhooks.length;
    const webhookRows = webhookCount ? this.renderWebhookRows(this.props.webhooks, this.state.currentPage, this.state.perPage) : null;

    return (

      <Layout.App>
        <h1>Webhooks</h1>
        <Button primary>Create Webhook</Button>
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
           pages={Math.ceil(webhookCount / this.state.perPage)}
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
  return { webhooks: webhooks.list };
}

export default connect(mapStateToProps, { listWebhooks })(WebhooksPage);
