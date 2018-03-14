import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';

// Actions
import { getWebhook, getEventDocs, updateWebhook } from 'src/actions/webhooks';
import { showAlert } from 'src/actions/globalAlert';
// Components
import { Panel } from '@sparkpost/matchbox';
import { PanelLoading } from 'src/components';
import WebhookForm from './WebhookForm';

import prepareWebhookUpdate from '../helpers/prepareWebhookUpdate';
import buildEventsTree from '../helpers/buildEventsTree';

export class EditTab extends Component {
  constructor(props) {
    super(props);

    this.buildEventsTree = _.memoize(buildEventsTree);
    this.getAllEvents = _.memoize(this.getAllEvents);
  }

  /*
    Dispatches eventDocs if it isn't set on state already
  */
  componentDidMount() {
    if (!this.props.eventDocs) {
      this.props.getEventDocs();
    }
  }

  /*
    Passed as onSubmit to WebhookForm. Figures out what updates need to be passed
    to the updateWebhook action.
  */
  handleSubmit = (values, webhook, allEvents) => {
    const { getWebhook, updateWebhook, showAlert } = this.props;

    const update = prepareWebhookUpdate(values, webhook, allEvents);

    return updateWebhook({ id: webhook.id, subaccount: webhook.subaccount, ...update })
      .then(() => {
        showAlert({ type: 'success', message: 'Update Successful' });
        getWebhook({ id: webhook.id, subaccount: webhook.subaccount });
      });
  }

  /*
    Makes an array with all possible events from the eventsTree.
    Memoized in constructor to limit unnecessary work
  */
  getAllEvents(eventsTree) {
    return _.flatten(_.map(eventsTree, ({ events }) => _.map(events, ({ key }) => (key))));
  }

  render() {
    const { webhook, eventDocs, eventsLoading } = this.props;
    const eventsTree = this.buildEventsTree(eventDocs);
    const allEvents = this.getAllEvents(eventsTree);
    const allChecked = webhook.events.length === allEvents.length;
    const checkedEvents = {};

    // Build event arrays if not all events
    if (!allChecked) {
      eventsTree.forEach(({ key, events }) => {
        const filtered = _.filter(events, ({ key }) => (_.includes(webhook.events, key)));
        checkedEvents[key] = _.map(filtered, ({ key }) => (key));
      });
    }

    // to match form values, where none is undefined
    if (webhook.auth_type === 'none') {
      delete webhook.auth_type;
    }

    if (eventsLoading) {
      return <PanelLoading />;
    }

    return (
      <Panel>
        <WebhookForm
          eventsTree={eventsTree}
          allChecked={allChecked}
          newWebhook={false}
          checkedEvents={checkedEvents}
          onSubmit={(values) => this.handleSubmit(values, webhook, allEvents)}/>
      </Panel>
    );
  }
}

const mapStateToProps = ({ webhooks, form }) => ({
  eventsLoading: webhooks.docsLoading,
  eventDocs: webhooks.docs
});

export default withRouter(connect(mapStateToProps, { getWebhook, getEventDocs, updateWebhook, showAlert })(EditTab));
