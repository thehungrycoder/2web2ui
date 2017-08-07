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
import WebhookTest from './components/WebhookTest';
import WebhooksLoading from './components/WebhooksLoading';

class WebhooksDetails extends Component {
  constructor (props) {
    super(props);

    // takes id from url param
    this.state = {
      id: this.props.match.params.id,
      updated: false,
      showBanner: false,
      showDelete: false,
      activeTab: 'settings'
    };

    this.buildEventsTree = _.once(this.buildEventsTree);
    this.getAllEvents = _.once(this.getAllEvents);
  }

  /*
    Dispatches eventDocs & getWebhook actions
  */
  componentDidMount () {
    this.props.getWebhook(this.state.id);

    // Only do this once
    if (!this.props.eventDocs) {
      this.props.getEventDocs();
    }
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
    Build an event tree based on the docs from /webhooks/documentation. Passed
    to _.once() in the constructor so it only happens once per mount.
    TODO: consider moving this to the reducer. This doesn't change from webhook
          to webhook, and if other resources need to use webhooks/documentation
          we can put it on its own key in the state.
  */
  buildEventsTree (eventGroups) {
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

  /*
    Makes an array with all possible events from the eventsTree.
    Bound _.once in constructor
  */
  getAllEvents (eventsTree) {
    return _.flatten(_.map(eventsTree, ({events}) => {
      return _.map(events, ({key}) => (key));
    }));
  }

  dismissBanner = () => {
    this.setState({ showBanner: false });
  }

  /*
    for delete modal, bound to modalHandleToggle in constructor
  */
  hideDelete = () => {
    this.setState({ showDelete: false });
  }

  /*
    tab switch, bound to testToggle in constructor
  */
  showTest = () => {
    this.setState({ activeTab: 'test' });
  }

  /*
    tab switch, bound to settingsToggle in constructor
  */
  showSettings = () => {
    this.setState({ activeTab: 'settings' });
  }

  render () {
    const { webhook, getLoading, eventsLoading } = this.props;

    /*
      Checks .events to guard from the create page redirect,
      which sets id on the state but doesn't have the rest of the webhook
    */
    if (webhook.id !== this.state.id || !webhook.events || getLoading || eventsLoading) {
      return (
        <WebhooksLoading
          title={''}
          breadcrumbAction={{ content: 'Webhooks', Component: Link, to: '/webhooks' }} />
      );
    }

    const { eventDocs, updateSuccess } = this.props;

    const eventsTree = this.buildEventsTree(eventDocs);
    const allEvents = this.getAllEvents(eventsTree);

    const allChecked = webhook.events.length === allEvents.length;
    const checkedEvents = {};

    // Build event arrays if not all events
    if (!allChecked) {
      eventsTree.forEach(({key, events}) => {
        const filtered = _.filter(events, ({key}) => (_.includes(webhook.events, key)));
        checkedEvents[key] = _.map(filtered, ({key}) => (key));
      });
    }

    // to match form values, where none is undefined
    if (webhook.auth_type === 'none') {
      delete webhook.auth_type;
    }

    const { activeTab, showBanner, showDelete } = this.state;

    const secondaryActions = [
      { content: 'Settings', onClick: this.showSettings, disabled: activeTab === 'settings' },
      { content: 'Test', onClick: this.showTest, disabled: activeTab === 'test' },
      { content: 'Delete', onClick: () => { this.setState({ showDelete: true }); } }
    ];

    return (
      <Layout.App>
        <Page
          title={webhook.name}
          secondaryActions={secondaryActions}
          breadcrumbAction={{ content: 'Webhooks', Component: Link, to: '/webhooks/' }}
        />
        { updateSuccess && showBanner &&
          <Banner title='Update Successful' status='success' onDismiss={this.dismissBanner}/>
        }
        <Panel sectioned>
          <Panel.Section>
            { activeTab === 'test'
              ? <WebhookTest webhook={webhook}/>
              : <WebhookForm eventsTree={eventsTree} allChecked={allChecked} newWebhook={false} checkedEvents={checkedEvents} onSubmit={(values) => { return this.updateWebhook(values, webhook, allEvents); }}/>
            }
          </Panel.Section>
        </Panel>
        <DeleteModal
          open={showDelete}
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
  eventsLoading: webhooks.docsLoading,
  eventDocs: webhooks.docs,
  updateSuccess: webhooks.updateSuccess
});

export default withRouter(connect(mapStateToProps, { getWebhook, getEventDocs, updateWebhook, deleteWebhook })(WebhooksDetails));
