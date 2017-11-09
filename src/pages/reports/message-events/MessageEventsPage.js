import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Page, Banner } from '@sparkpost/matchbox';
import { Loading, TableCollection, ApiErrorBanner } from 'src/components';
import { getMessageEvents } from 'src/actions/messageEvents';
import { formatMessageEvents } from 'src/selectors/messageEvents';

const maxResultsTitle = 'Note: A maximum of 1,000 results displayed';
const maxResultsText = 'SparkPost retains message event data for 10 days.';
const columns = ['Timestamp', 'Event', 'Recipient', 'Friendly From'];
const getRowData = ({ formattedDate, type, friendly_from, rcpt_to }) => ([ formattedDate, type, rcpt_to, friendly_from ]);

export class MessageEventsPage extends Component {

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
        <Banner status="info" title={maxResultsTitle}>{maxResultsText}</Banner>
        { error ? this.renderError() : this.renderCollection() }
      </Page>
    );

  }

}

const mapStateToProps = ({ messageEvents }) => {
  const events = formatMessageEvents(messageEvents.results);

  return {
    events: events,
    loading: messageEvents.pending,
    error: messageEvents.error
  };
};

export default withRouter(connect(mapStateToProps, { getMessageEvents })(MessageEventsPage));
