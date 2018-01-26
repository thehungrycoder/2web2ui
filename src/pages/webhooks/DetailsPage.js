import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link, Route } from 'react-router-dom';

// Actions
import { getWebhook, deleteWebhook } from '../../actions/webhooks';

// Components
import { Loading, DeleteModal } from 'src/components';
import { Page, Tabs } from '@sparkpost/matchbox';
import TestTab from './components/TestTab';
import EditTab from './components/EditTab';
import BatchTab from './components/BatchTab';

export class WebhooksDetails extends Component {
  state = {
    showDelete: false
  };

  /*
    Dispatches getWebhook action
  */
  componentDidMount() {
    this.props.getWebhook(this.props.match.params.id);
  }

  /*
    Calls deleteWebhook action then redirects to list page.
  */
  deleteWebhook = () => this.props.deleteWebhook(this.props.match.params.id).then(() => {
    this.props.history.push('/webhooks/');
  })

  /*
    for delete modal
  */
  toggleDelete = () => {
    this.setState({ showDelete: !this.state.showDelete });
  }

  render() {
    const { webhook, location, match } = this.props;
    const webhookId = match.params.id;
    const editPath = `/webhooks/details/${webhookId}`;
    const testPath = `/webhooks/details/${webhookId}/test`;
    const batchPath = `/webhooks/details/${webhookId}/batches`;
    const secondaryActions = [
      {
        content: 'Delete',
        onClick: this.toggleDelete
      }
    ];
    const tabs = [
      {
        content: 'Settings',
        Component: Link,
        to: editPath
      },
      {
        content: 'Test',
        Component: Link,
        to: testPath
      },
      {
        content: 'Batch Status',
        Component: Link,
        to: batchPath
      }
    ];
    const selectedTab = tabs.findIndex(({ to }) => location.pathname === to);

    /*
      Check .events to guard from the create page redirect,
      which sets id on the state but doesn't have the rest of the webhook
    */
    if ((webhook.id !== webhookId) || !webhook.events) {
      return <Loading />;
    }

    return (
      <Page
        title={webhook.name}
        secondaryActions={secondaryActions}
        breadcrumbAction={{ content: 'Webhooks', Component: Link, to: '/webhooks/' }} >
        <Tabs
          selected={selectedTab}
          tabs={tabs}
        />
        <Route exact path={editPath} render={() => <EditTab id={webhookId}/> } />
        <Route path={testPath} render={() => <TestTab webhook={webhook}/>} />
        <Route path={batchPath} render={() => <BatchTab id={webhookId}/>} />
        <DeleteModal
          open={this.state.showDelete}
          title='Are you sure you want to delete this webhook?'
          content={<p>The webhook will be permanently removed and send no further events. This cannot be undone.</p>}
          onCancel={this.toggleDelete}
          onDelete={this.deleteWebhook}
        />
      </Page>
    );
  }
}

const mapStateToProps = ({ webhooks }) => ({
  webhook: webhooks.webhook,
  getLoading: webhooks.getLoading,
  eventDocs: webhooks.docs
});

export default withRouter(connect(mapStateToProps, { getWebhook, deleteWebhook })(WebhooksDetails));
