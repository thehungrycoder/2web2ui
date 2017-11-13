import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Page, Banner } from '@sparkpost/matchbox';
import { Loading, TableCollection, ApiErrorBanner } from 'src/components';
import { getMessageEvents } from 'src/actions/messageEvents';
import { selectMessageEvents } from 'src/selectors/messageEvents';
import Empty from '../components/Empty';
import { listColumns, getListRowData } from './tableConfig';

const errorMsg = 'Sorry, we seem to have had some trouble loading your message events.';
const emptyMesasage = 'There are no message events for your current query';
const maxResultsTitle = 'Note: A maximum of 1,000 results displayed';
const maxResultsText = 'SparkPost retains message event data for 10 days.';

export class MessageEventsPage extends Component {

  componentDidMount() {
    this.props.getMessageEvents();
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
          columns={listColumns}
          rows={events}
          getRowData={getListRowData}
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
    loading: state.messageEvents.pending,
    error: state.messageEvents.error,
    empty: events.length === 0
  };
};

export default withRouter(connect(mapStateToProps, { getMessageEvents })(MessageEventsPage));
