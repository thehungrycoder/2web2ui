import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

// Actions
import { createWebhook as createAction, getEventDocs } from '../../actions/webhooks';

// Components
import Layout from '../../components/Layout/Layout';
import { Page, Panel } from '@sparkpost/matchbox';
import WebhookForm from './components/WebhookForm';

class WebhooksCreate extends Component {
  createWebhook (values, eventsTree) {
    const { name, target, eventsRadio, auth } = values;

    const webhook = {
      name: name,
      target: target
    };

    let events;

    if (eventsRadio === 'select') {
      const checkedEvents = _.concat(values.message_event, values.track_event, values.gen_event, values.unsubscribe_event, values.relay_event);
      events = _.filter(checkedEvents, (event) => (event)); // filter for truthy
    } else {
      events = _.flatten(_.map(eventsTree, ({events}) => {
        return _.map(events, ({key}) => (key));
      }));
    }

    webhook.events = events;

    switch (auth) {
      case 'basic':
        webhook.auth_type = 'basic';
        webhook.auth_credentials = {
          username: values.basicUser,
          password: values.basicPass
        };
        break;
      case 'oauth2':
        webhook.auth_type = 'oauth2';
        webhook.auth_request_details = {
          url: values.tokenURL,
          body: {
            client_id: values.clientId,
            client_secret: values.clientSecret
          }
        };
        break;
      default:
        break;
    }

    this.props.createAction(webhook);
  }

  buildEventsData (eventGroups) {
    return _.map(eventGroups, ({display_name, description, events}, key) => {
      return {
        key: key,
        label: display_name,
        description: description, // TODO: make tooltipes from this?
        events: _.map(events, ({display_name, description}, eventKey) => ({
          key: eventKey,
          label: display_name,
          description: description
        }))
      };
    });
  }

  componentDidMount () {
    this.props.getEventDocs();
  }

  render () {
    const { eventsLoading } = this.props;  // Form doesn't load until we have events

    if (eventsLoading) {
      return (
        <Layout.App>
          <Page
            title={'Create Webhook'}
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

    const {
      createLoading, // For disabling submit and gateing redirect
      eventDocs
    } = this.props;

    const eventsTree = Object.keys(eventDocs).length !== 0 ? this.buildEventsData(eventDocs) : [];

    return (
      <Layout.App>
        <Page
          title={'Create Webhook'}
          breadcrumbAction={{content: 'Webhooks', onClick: () => { this.props.history.push('/webhooks/'); }}}
        />
        <Panel>
          <Panel.Section>
            <WebhookForm eventsTree={eventsTree} newWebhook={true} submitting={createLoading} onSubmit={(values) => { this.createWebhook(values, eventsTree); }}/>
          </Panel.Section>
        </Panel>

      </Layout.App>
    );
  }
}

const mapStateToProps = ({ webhooks }) => ({
  createLoading: webhooks.createLoading,
  eventsLoading: webhooks.docsLoading,
  eventDocs: webhooks.docs
});

export default connect(mapStateToProps, { createAction, getEventDocs })(WebhooksCreate);
