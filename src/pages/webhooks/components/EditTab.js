import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getWebhook, getEventDocs, updateWebhook } from 'src/actions/webhooks';
import { showAlert } from 'src/actions/globalAlert';
import { Panel } from '@sparkpost/matchbox';
import { PanelLoading } from 'src/components';
import WebhookForm from './WebhookForm';
import resolveAuthUpdates from '../helpers/resolveAuthUpdates';
import { selectEventListing } from 'src/selectors/eventListing';

export class EditTab extends Component {

  componentDidMount() {
    if (!this.props.eventDocs) {
      this.props.getEventDocs();
    }
  }

  /*
    Passed as onSubmit to WebhookForm. Figures out what updates need to be passed
    to the updateWebhook action.
  */
  update = async (values, webhook, allEvents) => {
    const { getWebhook, updateWebhook, showAlert, eventListing } = this.props;
    const { name, target, active, events = [], eventsRadio } = values;
    const { id, subaccount } = webhook;

    await updateWebhook({
      id,
      subaccount,
      ...resolveAuthUpdates(values),
      name,
      target,
      active,
      events: (eventsRadio === 'all') ? Object.keys(eventListing) : Object.keys(events).filter((e) => events[e])
    });

    showAlert({ type: 'success', message: 'Update Successful' });
    getWebhook({ id, subaccount });
  }

  render() {
    const { webhook, eventsLoading, eventListing } = this.props;

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
          allChecked={webhook.events.length === Object.keys(eventListing).length}
          onSubmit={(values) => this.update(values, webhook)}
        />
      </Panel>
    );
  }
}

const mapStateToProps = (state) => ({
  eventsLoading: state.webhooks.docsLoading,
  eventListing: selectEventListing(state)
});

export default withRouter(connect(mapStateToProps, { getWebhook, getEventDocs, updateWebhook, showAlert })(EditTab));
