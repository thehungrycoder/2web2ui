import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import _ from 'lodash';

// Actions
import { getWebhook, getEventDocs, updateWebhook, deleteWebhook } from '../../actions/webhooks';

// Components
import Layout from '../../components/Layout/Layout';
import DeleteModal from '../../components/DeleteModal/DeleteModal';
import { Page, Panel, Banner } from '@sparkpost/matchbox';
import WebhookForm from './components/WebhookForm';
import WebhookTest from './components/WebhookTest/WebhookTest';

class WebhooksEdit extends Component {
  constructor (props) {
    super(props);

    // takes id from url param
    this.state = {
      id: this.props.match.params.id,
      updated: false,
      showBanner: false,
      showDelete: false,
      settingsTab: true,
      testTab: false
    };

    this.onDismiss = this.dismissBanner.bind(this);
    this.modalHandleToggle = this.hideDelete.bind(this);
    this.modalHandleDelete = this.deleteWebhook.bind(this);
    this.testToggle = this.showTest.bind(this);
    this.settingsToggle = this.showSettings.bind(this);
  }

  /*
    Dispatches eventDocs & getWebhook actions
  */
  componentDidMount () {
    this.props.getEventDocs();
    this.props.getWebhook(this.state.id);
  }

  /*
   Gets webhook if the updated is true, then resets updated to false
   and sets showBanner
  */
  componentDidUpdate () {
    if (this.state.updated) {
      this.props.getWebhook(this.state.id);
      this.setState({ updated: false, showBanner: true });
    }
  }

  /*
    Called by updateWebhook. Figures out if the webhooks auth details need to be updated,
    then returns those updates if so.
  */
  resolveAuthUpdates (values, webhook) {
    const { auth, basicUser, basicPass, clientId, clientSecret, tokenURL } = values;
    const update = {};

    // none is undefined !== undefined
    if (auth !== webhook.auth_type) {
      switch (auth) {
        case 'basic':
          update.auth_type = 'basic';
          update.auth_credentials = { username: basicUser, password: basicPass };
          break;
        case 'oauth2':
          update.auth_type = 'oauth2';
          update.auth_request_details = {
            url: tokenURL,
            body: { client_id: clientId, client_secret: clientSecret }
          };
          break;
        default:
          update.auth_type = 'none';
          break;
      }
    } else {
      const {
        auth_credentials: authCredentials,
        auth_request_details: authRequestDetails
      } = webhook;

      switch (auth) {
        case 'basic':
          if (authCredentials.username !== basicUser ||
              authCredentials.password !== basicPass) {
            update.auth_credentials = { username: basicUser, password: basicPass };
          }
          break;
        case 'oauth2':
          if (authRequestDetails.url !== tokenURL ||
              authCredentials.body.client_id !== clientId ||
              authCredentials.body.client_secret !== clientSecret) {
            update.auth_request_details = {
              url: tokenURL,
              body: { client_id: clientId, client_secret: clientSecret }
            };
          }
          break;
        default:
          update.auth_type = 'none';
          break;
      }
    }
    return update;
  }

  /*
    Passed as onSubmit to WebhookForm. Figures out what updates need to be passed
    to the updateWebhook action.
  */
  updateWebhook (values, webhook, allEvents) {
    const authDetails = this.resolveAuthUpdates(values, webhook);

    const update = { ...authDetails };

    if (values.name !== webhook.name) {
      update.name = values.name;
    }

    if (values.target !== webhook.target) {
      update.target = values.target;
    }

    const checkedEvents = _.concat(values.message_event, values.track_event, values.gen_event, values.unsubscribe_event, values.relay_event);

    // "All" selected, or all boxes clicked
    if (values.eventsRadio === 'all' || checkedEvents.length === allEvents.length) {
      if (webhook.events.length !== allEvents.length) {
        update.events = allEvents;
      }
    } else {
      if (!_.isEqual(webhook.events, checkedEvents)) {
        update.events = _.filter(checkedEvents, (event) => (event)); // remove for truthy
      }
    }

    if (Object.keys(update).length !== 0) {
      return this.props.updateWebhook(webhook.id, update).then(() => {
        this.setState({ updated: true });
      });
    }
  }

  buildEventsData (eventGroups) {
    return _.map(eventGroups, ({display_name, description, events}, key) => {
      return {
        key: key,
        label: display_name,
        description: description,
        events: _.map(events, ({display_name, description}, eventKey) => ({
          key: eventKey,
          label: display_name,
          description: description
        }))
      };
    });
  }

  dismissBanner () {
    this.setState({ showBanner: false });
  }

  hideDelete () {
    this.setState({ showDelete: false });
  }

  showTest () {
    this.setState({ testTab: true, settingsTab: false });
  }

  showSettings () {
    this.setState({ testTab: false, settingsTab: true });
  }

  deleteWebhook () {
    return this.props.deleteWebhook(this.state.id).then(() => {
      this.props.history.push('/webhooks/');
    });
  }

  render () {
    const { webhook, getLoading, eventsLoading } = this.props;

    if (webhook.id !== this.state.id || getLoading || eventsLoading) {
      return (
        <Layout.App>
          <Page
            title={'Webhook Settings'}
            breadcrumbAction={{ content: 'Webhooks', Component: Link, to: '/webhooks' }}
          />
          <Panel>
            <Panel.Section>
              Loading...
            </Panel.Section>
          </Panel>
        </Layout.App>
      );
    }

    const { eventDocs, updateSuccess } = this.props;

    const eventsTree = Object.keys(eventDocs).length !== 0 ? this.buildEventsData(eventDocs) : [];

    // to match form values, where none is undefined
    if (webhook.auth_type === 'none') {
      delete webhook.auth_type;
    }

    // used for allEvents prop and passed to updateWebhook()
    const allEvents = _.flatten(_.map(eventsTree, ({events}) => {
      return _.map(events, ({key}) => (key));
    }));

    const allChecked = webhook.events.length === allEvents.length;
    const checkedEvents = {};

    // Build event arrays if not all events
    if (!allChecked) {
      eventsTree.forEach(({key, events}) => {
        const filtered = _.filter(events, ({key}) => (_.includes(webhook.events, key)));
        checkedEvents[key] = _.map(filtered, ({key}) => (key));
      });
    }

    const secondaryActions = [
      { content: 'Settings', onClick: this.settingsToggle, disabled: this.state.settingsTab },
      { content: 'Test', onClick: this.testToggle, disabled: this.state.testTab },
      { content: 'Delete', onClick: () => { this.setState({ showDelete: true }); } }
    ];

    return (
      <Layout.App>
        <Page
          title={webhook.name}
          secondaryActions={secondaryActions}
          breadcrumbAction={{ content: 'Webhooks', Component: Link, to: '/webhooks/' }}
        />
        { updateSuccess && this.state.showBanner &&
          <Banner title='Update Successful' status='success' onDismiss={this.onDismiss}/>
        }
        <Panel sectioned>
          <Panel.Section>
            { this.state.testTab
              ? <WebhookTest webhook={webhook}/>
              : <WebhookForm eventsTree={eventsTree} allChecked={allChecked} newWebhook={false} checkedEvents={checkedEvents} onSubmit={(values) => { return this.updateWebhook(values, webhook, allEvents); }}/>
            }
          </Panel.Section>
        </Panel>
        <DeleteModal
          open={this.state.showDelete}
          title='Delete Webhook'
          text='Are you sure you want to delete this webhook?'
          handleToggle={this.modalHandleToggle}
          handleDelete={this.modalHandleDelete}
        />
      </Layout.App>
    );
  }
}

const mapStateToProps = ({ webhooks }) => ({
  webhook: webhooks.webhook,
  getLoading: webhooks.getLoading,
  eventsLoading: webhooks.docsLoading,
  eventDocs: webhooks.docs,
  updateSuccess: webhooks.updateSuccess
});

export default withRouter(connect(mapStateToProps, { getWebhook, getEventDocs, updateWebhook, deleteWebhook })(WebhooksEdit));
