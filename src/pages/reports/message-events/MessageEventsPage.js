import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Page } from '@sparkpost/matchbox';
import { Loading, TableCollection, ApiErrorBanner } from 'src/components';
import { getMessageEvents } from 'src/actions/messageEvents';

const columns = ['Timestamp', 'Event', 'Campaign', 'Friendly From', 'Recipient', 'Message ID'];
const getRowData = ({ timestamp, type, campaign_id, friendly_from, rcpt_to, message_id }) =>
  ([ timestamp, type, campaign_id, friendly_from, rcpt_to, message_id ]);

class MessageEventsPage extends Component {

  componentDidMount() {
    this.props.getMessageEvents();
  }

  renderError() {
    const { error, getMessageEvents } = this.props;
    return (
      <ApiErrorBanner
        message={'Sorry, we seem to have had some trouble loading your message events.'}
        errorDetails={error.message}
        reload={getMessageEvents}
      />
    );
  }

  renderCollection() {
    const { events } = this.props;
    return (
      <TableCollection
        columns={columns}
        rows={events}
        getRowData={getRowData}
        pagination={true}
      />
    );
  }

  render() {
    const { loading, error } = this.props;

    if (loading) {
      return <Loading />;
    }

    return (
      <Page title='Message Events'>
        { error ? this.renderError() : this.renderCollection() }
      </Page>
    );

  }

}

const mapStateToProps = ({ messageEvents }) => ({
  events: messageEvents.results,
  loading: messageEvents.pending,
  error: messageEvents.error
});

export default withRouter(connect(mapStateToProps, { getMessageEvents })(MessageEventsPage));
