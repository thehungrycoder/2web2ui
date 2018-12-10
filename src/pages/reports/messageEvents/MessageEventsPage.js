import React, { Component } from 'react';
import { connect } from 'react-redux';
import { snakeToFriendly } from 'src/helpers/string';
import { Page, Banner } from '@sparkpost/matchbox';
import { PanelLoading, TableCollection, ApiErrorBanner, Empty } from 'src/components';
import DisplayDate from './components/DisplayDate';
import MessageEventsSearch from './components/MessageEventsSearch';
import ViewDetailsButton from './components/ViewDetailsButton';
import { getMessageEvents } from 'src/actions/events';
import { selectMessageEvents } from 'src/selectors/events';

const errorMsg = 'Sorry, we seem to have had some trouble loading your message events.';
const emptyMesasage = 'There are no message events for your current query';
const maxResults = 1000;
const maxResultsTitle = 'Note: A maximum of 1,000 results displayed';
const maxResultsText = 'You may want to narrow your search for better results. SparkPost retains message event data for 10 days.';

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
  };

  renderError() {
    const { error, getMessageEvents, search } = this.props;
    return (
      <ApiErrorBanner
        message={errorMsg}
        errorDetails={error.message}
        reload={() => getMessageEvents(search)}
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
          {events.length >= maxResults &&
            <Banner status="info" title={maxResultsTitle}>{maxResultsText}</Banner>
          }

          <TableCollection
            columns={columns}
            rows={events}
            getRowData={this.getRowData}
            pagination
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
      <Page title='Events'>
        <MessageEventsSearch />
        {error ? this.renderError() : this.renderCollection()}
      </Page>
    );
  }

}

const mapStateToProps = (state) => {
  const events = selectMessageEvents(state);

  return {
    events: events,
    loading: state.events.loading,
    error: state.events.error,
    empty: events.length === 0,
    search: state.events.search
  };
};

export default connect(mapStateToProps, { getMessageEvents })(MessageEventsPage);
