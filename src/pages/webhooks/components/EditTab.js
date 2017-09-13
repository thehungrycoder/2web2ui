import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';

// Actions
import { getWebhook, getEventDocs, updateWebhook } from '../../../actions/webhooks';

// Components
import { Panel, Banner } from '@sparkpost/matchbox';
import WebhookForm from './WebhookForm';

import prepareWebhookUpdate from '../helpers/prepareWebhookUpdate';
import buildEventsTree from '../helpers/buildEventsTree';

class EditTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      updated: false,
      showBanner: false
    };

    this.buildEventsTree = _.once(buildEventsTree);
    this.getAllEvents = _.once(this.getAllEvents);
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
   Gets webhook if updated, then resets updated to false
   and sets showBanner.
  */
  componentDidUpdate() {
    if (this.state.updated) {
      this.props.getWebhook(this.props.id);
      this.setState({ updated: false, showBanner: true });
    }
  }

  /*
    Passed as onSubmit to WebhookForm. Figures out what updates need to be passed
    to the updateWebhook action.
  */
  updateWebhook(values, webhook, allEvents) {
    const update = prepareWebhookUpdate(values, webhook, allEvents);

    if (Object.keys(update).length !== 0) {
      return this.props.updateWebhook(webhook.id, update).then(() => {
        this.setState({ updated: true });
      });
    }
  }

  /*
    Makes an array with all possible events from the eventsTree.
    Bound to a _.once in constructor
  */
  getAllEvents(eventsTree) {
    return _.flatten(_.map(eventsTree, ({ events }) => _.map(events, ({ key }) => (key))));
  }

  dismissBanner = () => {
    this.setState({ showBanner: false });
  }

  /*
    Renders a banner based on whether the update succeded or failed
    TODO: Make a global wrapper for banner that behaves like this.
  */
  renderBanner = (updateSuccess) => {
    const title = updateSuccess ? 'Update Successful' : 'Update Failed';
    const status = updateSuccess ? 'success' : 'danger';

    return <Banner title={title} status={status} onDismiss={this.dismissBanner}/>;
  }

  render() {
    const { webhook, eventDocs, eventsLoading } = this.props;
    const eventsTree = buildEventsTree(eventDocs);
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

    const { showBanner } = this.state;

    return (
      <Panel sectioned>
        { showBanner && this.renderBanner(this.props.updateSuccess) }
        <Panel.Section>
          {eventsLoading ? 'Loading...' : (
            <WebhookForm eventsTree={eventsTree} allChecked={allChecked} newWebhook={false} checkedEvents={checkedEvents} onSubmit={(values) => this.updateWebhook(values, webhook, allEvents)}/>
          )}
        </Panel.Section>
      </Panel>
    );
  }
}

const mapStateToProps = ({ webhooks }) => ({
  webhook: webhooks.webhook,
  eventsLoading: webhooks.docsLoading,
  eventDocs: webhooks.docs,
  updateSuccess: webhooks.updateSuccess
});

export default withRouter(connect(mapStateToProps, { getWebhook, getEventDocs, updateWebhook })(EditTab));
