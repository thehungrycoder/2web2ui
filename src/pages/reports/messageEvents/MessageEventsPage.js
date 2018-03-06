import React, { Component } from 'react';
import { connect } from 'react-redux';
import { snakeToFriendly } from 'src/helpers/string';
import { Page, Banner } from '@sparkpost/matchbox';
import { PanelLoading, TableCollection, ApiErrorBanner, Empty } from 'src/components';
import DisplayDate from './components/DisplayDate';
import MessageEventsSearch from './components/MessageEventsSearch';
import ViewDetailsButton from './components/ViewDetailsButton';
import { getMessageEvents } from 'src/actions/messageEvents';
import { selectMessageEvents } from 'src/selectors/messageEvents';
const errorMsg = 'Sorry, we seem to have had some trouble loading your message events.';
const emptyMesasage = 'There are no message events for your current query';
const maxResults = 1000;
const maxResultsTitle = 'Note: A maximum of 1,000 results displayed';
const maxResultsText = 'SparkPost retains message event data for 10 days.';

const columns = [
  { label: 'Time', sortKey: 'timestamp' },
  { label: 'Event', sortKey: 'type' },
  { label: 'Recipient', sortKey: 'rcpt_to' },
  { label: 'Friendly From', sortKey: 'friendly_from' },
  null
];

export class MessageEventsPage extends Component {

  getRowData = (rowData) => {
    const { timestamp, formattedDate, type, friendly_from, rcpt_to } = rowData;
    return [
      <DisplayDate timestamp={timestamp} formattedDate={formattedDate} />,
      snakeToFriendly(type),
      rcpt_to,
      friendly_from,
      <ViewDetailsButton {...rowData} />
    ];
  }

  renderError() {
    // TODO: this reload will load message events with no date or other filters, but error state
    // might be triggered by a certain filter combination so reload should probably use those
    const { error, getMessageEvents } = this.props;
    return (
      <ApiErrorBanner
        message={errorMsg}
        errorDetails={error.message}
        reload={getMessageEvents}
      />
    );
  }

  renderCollection() {
    const { events, empty, loading } = this.props;

    if (loading) {
      return <PanelLoading />;
    }

    const content = empty
      ? <Empty message={emptyMesasage} />
      : (
        <div>
          { events.length >= maxResults &&
            <Banner status="info" title={maxResultsTitle}>{maxResultsText}</Banner>
          }

          <TableCollection
            columns={columns}
            rows={events}
            getRowData={this.getRowData}
            pagination={true}
            defaultSortColumn='timestamp'
            defaultSortDirection='desc'
          />
        </div>
      );

    return content;
  }

  render() {
    const { error } = this.props;

    return (
      <Page title='Message Events'>
        <Panel sectioned>
          <MessageEventsSearch />
        </Panel>
        { error ? this.renderError() : this.renderCollection() }
      </Page>
    );
  }

}

const mapStateToProps = (state) => {
  const events = selectMessageEvents(state);

  return {
    events: events,
    loading: state.messageEvents.loading,
    error: state.messageEvents.error,
    empty: events.length === 0
  };
};

export default connect(mapStateToProps, { getMessageEvents })(MessageEventsPage);
