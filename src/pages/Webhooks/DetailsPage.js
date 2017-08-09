import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link, Route } from 'react-router-dom';
import _ from 'lodash';

// Actions
import { getWebhook, deleteWebhook } from '../../actions/webhooks';

// Components
import Layout from '../../components/Layout/Layout';
import DeleteModal from '../../components/DeleteModal/DeleteModal';
import { Page } from '@sparkpost/matchbox';
import WebhooksLoading from './components/WebhooksLoading';
import TestTab from './components/TestTab';
import EditTab from './components/EditTab';

class WebhooksDetails extends Component {
  constructor (props) {
    super(props);

    this.state = {
      id: props.match.params.id,
      activeTab: 'settings'
    };
  }

  /*
    Dispatches getWebhook action
  */
  componentDidMount () {
    this.props.getWebhook(this.state.id);
  }

  /*
    Calls deleteWebhook action then redirects to list page.
    Bound to modalHandleDelete in constructor
  */
  deleteWebhook = () => {
    return this.props.deleteWebhook(this.state.id).then(() => {
      this.props.history.push('/webhooks/');
    });
  }

  /*
    for delete modal
  */
  hideDelete = () => {
    this.setState({ showDelete: false });
  }

  /*
    tab switch
  */
  showTest = () => {
    this.setState({ activeTab: 'test' });
  }

  /*
    tab switch
  */
  showSettings = () => {
    this.setState({ activeTab: 'settings' });
  }

  render () {
    const { webhook } = this.props;
    const webhookId = this.state.id;

    /*
      Checks .events to guard from the create page redirect,
      which sets id on the state but doesn't have the rest of the webhook
    */
    if (webhook.id !== webhookId || !webhook.events) {
      return (
        <WebhooksLoading
          title={''}
          breadcrumbAction={{ content: 'Webhooks', Component: Link, to: '/webhooks' }} />
      );
    }

    const editPath = `/webhooks/details/${webhookId}`;
    const testPath = `/webhooks/details/${webhookId}/test`;

    const testTab = _.endsWith(this.props.match.url, 'test');

    // TODO: Disabled doesn't work with Link here
    const secondaryActions = [
      { content: 'Settings', Component: Link, to: editPath, disabled: !testTab },
      { content: 'Test', Component: Link, to: testPath, disabled: testTab },
      { content: 'Delete', onClick: () => { this.setState({ showDelete: true }); } }
    ];

    return (
      <Layout.App>
        <Page
          title={webhook.name}
          secondaryActions={secondaryActions}
          breadcrumbAction={{ content: 'Webhooks', Component: Link, to: '/webhooks/' }}
        />
        <div>
          <Route exact path={editPath} render={() => <EditTab id={webhookId}/> } />
          <Route path={testPath} render={() => <TestTab webhook={webhook}/>} />
        </div>
        <DeleteModal
          open={this.state.showDelete}
          title='Delete Webhook'
          text='Are you sure you want to delete this webhook?'
          handleToggle={this.hideDelete}
          handleDelete={this.deleteWebhook}
        />
      </Layout.App>
    );
  }
}

const mapStateToProps = ({ webhooks }) => ({
  webhook: webhooks.webhook,
  getLoading: webhooks.getLoading,
  eventDocs: webhooks.docs
});

export default withRouter(connect(mapStateToProps, { getWebhook, deleteWebhook })(WebhooksDetails));
