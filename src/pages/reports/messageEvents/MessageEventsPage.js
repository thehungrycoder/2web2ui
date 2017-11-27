import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { snakeToFriendly } from 'src/helpers/string';
import { Page, Banner, Button } from '@sparkpost/matchbox';
import { Loading, TableCollection, ApiErrorBanner } from 'src/components';
import DisplayDate from './components/DisplayDate';
import { getMessageEvents } from 'src/actions/messageEvents';
import { selectMessageEvents } from 'src/selectors/messageEvents';
import Empty from '../components/Empty';

const errorMsg = 'Sorry, we seem to have had some trouble loading your message events.';
const emptyMesasage = 'There are no message events for your current query';
const maxResultsTitle = 'Note: A maximum of 1,000 results displayed';
const maxResultsText = 'SparkPost retains message event data for 10 days.';

const columns = ['Time', 'Event', 'Recipient', 'Friendly From', null];

export class MessageEventsPage extends Component {

  componentDidMount() {
    this.props.getMessageEvents();
  }

  handleDetailClick = ({ message_id, event_id }) => {
    const { history } = this.props;
    history.push({
      pathname: `/reports/message-events/details/${message_id}`,
      state: { selectedEventId: event_id }
    });
  }

  getRowData = (rowData) => {
    const { timestamp, formattedDate, type, friendly_from, rcpt_to, message_id, event_id } = rowData;
    return [
      <DisplayDate timestamp={timestamp} formattedDate={formattedDate} />,
      snakeToFriendly(type),
      rcpt_to,
      friendly_from,
      <div style={{ textAlign: 'right' }}>
        <Button onClick={() => this.handleDetailClick({ message_id, event_id })} size='small'>View Details</Button>
      </div>
    ];
  }

  renderError() {
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
    const { events, empty } = this.props;

    const content = empty
      ? <Empty message={emptyMesasage} />
      : (
        <TableCollection
          columns={columns}
          rows={events}
          getRowData={this.getRowData}
          pagination={true}
        />
      );

    return content;
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

const mapStateToProps = (state) => {
  const events = selectMessageEvents(state);

  return {
    events: events,
    loading: state.messageEvents.loading,
    error: state.messageEvents.error,
    empty: events.length === 0
  };
};

export default withRouter(connect(mapStateToProps, { getMessageEvents })(MessageEventsPage));
