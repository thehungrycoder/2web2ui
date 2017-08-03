import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';

// Actions
import { getWebhook, getEventDocs, updateWebhook } from '../../actions/webhooks';

// Components
import Layout from '../../components/Layout/Layout';
import { Page, Panel, Banner } from '@sparkpost/matchbox';
import WebhookForm from './components/WebhookForm';

class WebhooksEdit extends Component {
  constructor (props) {
    super(props);

    this.state = {
      id: this.props.match.params.id,
      updated: false,
      showBanner: false
    };

    this.onDismiss = this.dismissBanner.bind(this);
  }

  componentWillMount () {
    this.props.getEventDocs();
    this.props.getWebhook(this.state.id);
  }

  componentWillUpdate () {
    if (this.state.updated) {
      this.props.getWebhook(this.state.id);
      this.setState({ updated: false, showBanner: true });
    }
  }

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
      this.props.updateWebhook(webhook.id, update);
      this.setState({ updated: true });
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
    this.setState({showBanner: false});
  }

  render () {
    const { webhook, getLoading, eventsLoading } = this.props;

    if (webhook.id !== this.state.id || eventsLoading || getLoading) {
      return (
        <Layout.App>
          <Page
            title={'Edit Webhook'}
            breadcrumbAction={{content: 'Webhooks', onClick: () => { this.props.history.push('/webhooks/'); }}}
          />
          <Panel>
            <Panel.Section>
              Loading...
            </Panel.Section>
          </Panel>
        </Layout.App>
      );
    }

    const { eventDocs, updateLoading, updateSuccess } = this.props;

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

    return (
      <Layout.App>
        { updateSuccess && this.state.showBanner &&
          <Banner title='Update Successful' status='success' onDismiss={this.onDismiss}/>
        }
        <Page
          title={webhook.name}
          breadcrumbAction={{content: 'Webhooks', onClick: () => { this.props.history.push('/webhooks/'); }}}
        />
        <Panel>
          <Panel.Section>
            <WebhookForm eventsTree={eventsTree} submitting={updateLoading} allChecked={allChecked} newWebhook={false} checkedEvents={checkedEvents} onSubmit={(values) => { this.updateWebhook(values, webhook, allEvents); }}/>
          </Panel.Section>
        </Panel>
      </Layout.App>
    );
  }
}

const mapStateToProps = ({ webhooks }) => ({
  webhook: webhooks.webhook,
  getLoading: webhooks.getLoading,
  eventsLoading: webhooks.docsLoading,
  eventDocs: webhooks.docs,
  updateLoading: webhooks.updateLoading,
  updateSuccess: webhooks.updateSuccess
});

export default withRouter(connect(mapStateToProps, { getWebhook, getEventDocs, updateWebhook })(WebhooksEdit));
