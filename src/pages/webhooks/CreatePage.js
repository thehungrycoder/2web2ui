import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import _ from 'lodash';

// Actions
import { createWebhook, getEventDocs } from 'src/actions/webhooks';
import { showAlert } from 'src/actions/globalAlert';
// Components
import { Loading } from 'src/components';
import { Page, Panel } from '@sparkpost/matchbox';
import WebhookForm from './components/WebhookForm';
import { setSubaccountQuery } from 'src/helpers/subaccounts';

export class WebhooksCreate extends Component {
  componentDidMount() {
    if (!this.props.eventDocs) {
      this.props.getEventDocs();
    }
  }

  /*
    Makes a webhook object from form values and calls the createWebhook action
    with it. Invoked in the form's onSubmit func
  */
  createWebhook(values, eventsTree) {
    const { createWebhook, showAlert } = this.props;
    const { name, target, subaccount, eventsRadio, auth, assignTo } = values;

    const webhook = {
      name,
      target
    };

    let events;
    let subaccountId;

    if (eventsRadio === 'select') {
      events = _.compact(_.concat(values.message_event, values.track_event, values.gen_event, values.unsubscribe_event, values.relay_event));
    } else {
      // all events
      events = _.flatten(_.map(eventsTree, ({ events }) => _.map(events, ({ key }) => (key))));
    }

    webhook.events = events;

    // builds the webhooks auth details from the form values
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
      default: // none
        break;
    }

    // Value from the radio group
    if (assignTo === 'master') {
      subaccountId = 0;
    }

    // 'values.subaccount' only available if assignTo = 'subaccount'
    if (assignTo === 'subaccount') {
      subaccountId = subaccount.id;
    }

    return createWebhook({ webhook, subaccount: subaccountId })
      .then(() => showAlert({ type: 'success', message: 'Webhook created' }));
  }

  componentDidUpdate(prevProps) {
    const { webhook, history } = this.props;

    // Handles the history push after create
    if (_.isEmpty(prevProps.webhook) && !_.isEmpty(webhook)) {
      history.push(`/webhooks/details/${webhook.id}${setSubaccountQuery(webhook.subaccount)}`);
    }
  }

  /*
    Builds a tree of event data, based on the eventDocs, for the form to create
    the checkbox groups with.
  */
  buildEventsData(eventGroups) {
    return _.map(eventGroups, ({ display_name, description, events }, key) => ({
      key,
      label: display_name,
      description,
      events: _.map(events, ({ display_name, description }, eventKey) => ({
        key: eventKey,
        label: display_name,
        description
      }))
    }));
  }

  render() {
    const { eventDocs, eventsLoading } = this.props; // Form doesn't load until we have events
    const eventsTree = this.buildEventsData(eventDocs);

    if (eventsLoading) {
      return <Loading />;
    }

    return (
      <Page title='Create Webhook' breadcrumbAction={{ content: 'Webhooks', Component: Link, to: '/webhooks' }} >
        <Panel>
          <WebhookForm eventsTree={eventsTree} newWebhook={true} onSubmit={(values) => this.createWebhook(values, eventsTree)}/>
        </Panel>
      </Page>
    );
  }
}

const mapStateToProps = ({ webhooks }) => ({
  webhook: webhooks.webhook,
  eventsLoading: webhooks.docsLoading,
  eventDocs: webhooks.docs
});

export default withRouter(connect(mapStateToProps, { createWebhook, getEventDocs, showAlert })(WebhooksCreate));
