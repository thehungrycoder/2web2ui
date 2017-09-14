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
    const update = prepareWebhookUpdate(values, webhook, allEvents);

    if (Object.keys(update).length !== 0) {
      return this.props.updateWebhook(webhook.id, update)
        .then(() => {
          this.setState({ showBanner: true });
          this.props.getWebhook(webhook.id);
        })
        .catch((err) => {
          this.setState({ showBanner: true });
          throw err;
        });
    }
  }

  /*
    Makes an array with all possible events from the eventsTree.
    Memoized in constructor to limit unnecessary work
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
  renderBanner = () => {
    const { updateSuccess, updateError } = this.props;
    const title = updateSuccess ? 'Update Successful' : 'Update Failed';
    const status = updateSuccess ? 'success' : 'danger';
    const message = _.get(updateError, 'response.data.errors[0].message', null);

    return <Banner title={title} status={status} onDismiss={this.dismissBanner}>{message}</Banner>;
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

    const { showBanner } = this.state;

    return (
      <Panel sectioned>
        {showBanner && this.renderBanner()}
        <Panel.Section>
          {eventsLoading ? 'Loading...' : (
            <WebhookForm eventsTree={eventsTree} allChecked={allChecked} newWebhook={false} checkedEvents={checkedEvents} onSubmit={(values) => this.handleSubmit(values, webhook, allEvents)}/>
          )}
        </Panel.Section>
      </Panel>
    );
  }
}

const mapStateToProps = ({ webhooks, form }) => ({
  webhook: webhooks.webhook,
  eventsLoading: webhooks.docsLoading,
  eventDocs: webhooks.docs,
  updateSuccess: webhooks.updateSuccess,
  updateError: webhooks.updateError
});

export default withRouter(connect(mapStateToProps, { getWebhook, getEventDocs, updateWebhook })(EditTab));
