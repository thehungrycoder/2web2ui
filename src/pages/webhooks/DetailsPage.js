import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link, Route } from 'react-router-dom';
import _ from 'lodash';
// Actions
import { getWebhook, deleteWebhook } from '../../actions/webhooks';

// Components
import { DeleteModal } from 'src/components';
import { Page, Tabs } from '@sparkpost/matchbox';
import TestTab from './components/TestTab';
import EditTab from './components/EditTab';

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

  /*
    tab switch
  */
  showTest = () => {
    this.setState({ selectedTab: 1 });
  }

  /*
    tab switch
  */
  showSettings = () => {
    this.setState({ selectedTab: 0 });
  }

  render() {
    const { webhook, location } = this.props;
    const webhookId = this.id;
    const selectedTab = _.endsWith(location.pathname, 'test') ? 1 : 0;

    /*
      Check .events to guard from the create page redirect,
      which sets id on the state but doesn't have the rest of the webhook
    */
    const isLoading = (webhook.id !== webhookId) || !webhook.events;

    if (!isLoading) {
      return (
        <div loading={isLoading}>
          <Page
            title={webhook.name}
            secondaryActions={this.secondaryActions}
            breadcrumbAction={{ content: 'Webhooks', Component: Link, to: '/webhooks/' }}
          />
          <Tabs
            selected={selectedTab}
            tabs={this.tabs}
          />
          <Route exact path={this.editPath} render={() => <EditTab id={webhookId}/> } />
          <Route path={this.testPath} render={() => <TestTab webhook={webhook}/>} />
          <DeleteModal
            open={this.state.showDelete}
            title='Delete Webhook'
            text='Are you sure you want to delete this webhook?'
            handleToggle={this.toggleDelete}
            handleDelete={this.deleteWebhook}
          />
        </div>
      );
    }

    return null;
  }
}

const mapStateToProps = ({ webhooks }) => ({
  webhook: webhooks.webhook,
  getLoading: webhooks.getLoading,
  eventDocs: webhooks.docs
});

export default withRouter(connect(mapStateToProps, { getWebhook, deleteWebhook })(WebhooksDetails));
