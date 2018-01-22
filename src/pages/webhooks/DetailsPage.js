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

class WebhooksDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showDelete: false
    };

    const { id } = props.match.params;

    this.id = id;
    this.editPath = `/webhooks/details/${id}`;
    this.testPath = `/webhooks/details/${id}/test`;
    this.batchPath = `/webhooks/details/${id}/batches`;

    this.secondaryActions = [
      {
        content: 'Delete',
        onClick: this.toggleDelete
      }
    ];

    this.tabs = [
      {
        content: 'Settings',
        Component: Link,
        to: this.editPath
      },
      {
        content: 'Test',
        Component: Link,
        to: this.testPath
      },
      {
        content: 'Batch Status',
        Component: Link,
        to: this.batchPath
      }
    ];
  }

  /*
    Dispatches getWebhook action
  */
  componentDidMount() {
    this.props.getWebhook(this.id);
  }

  /*
    Calls deleteWebhook action then redirects to list page.
  */
  deleteWebhook = () => this.props.deleteWebhook(this.id).then(() => {
    this.props.history.push('/webhooks/');
  })

  /*
    for delete modal
  */
  toggleDelete = () => {
    this.setState({ showDelete: !this.state.showDelete });
  }

  render() {
    const { webhook, location } = this.props;
    const webhookId = this.id;
    const selectedTab = this.tabs.findIndex(({ to }) => location.pathname === to);

    /*
      Check .events to guard from the create page redirect,
      which sets id on the state but doesn't have the rest of the webhook
    */
    const isLoading = (webhook.id !== webhookId) || !webhook.events;
    if (isLoading) {
      return <Loading />;
    }


    return (
      <Page
        title={webhook.name}
        secondaryActions={this.secondaryActions}
        breadcrumbAction={{ content: 'Webhooks', Component: Link, to: '/webhooks/' }} >
        <Tabs
          selected={selectedTab}
          tabs={this.tabs}
        />
        <Route exact path={this.editPath} render={() => <EditTab id={webhookId}/> } />
        <Route path={this.testPath} render={() => <TestTab webhook={webhook}/>} />
        <Route path={this.batchPath} render={() => <BatchTab id={webhookId}/>} />
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
