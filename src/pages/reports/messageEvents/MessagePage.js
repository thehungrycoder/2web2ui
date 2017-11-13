/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { subDays, format } from 'date-fns';

import { Loading, TableCollection } from 'src/components';
import { Page, Grid, Panel } from '@sparkpost/matchbox';

import { getMessageEvents } from 'src/actions/messageEvents';
import { selectMessageEvents } from 'src/selectors/messageEvents';

import { getMessageRowData } from './tableConfig';
import MessageTableHeader from './components/MessageTableHeader';

const breadcrumbAction = {
  content: 'All Message Events',
  Component: Link,
  to: '/reports/message-events'
}

export class MessagePage extends Component {
  state = {
    selectedId: null
  }

  componentDidMount() {
    const { messageId, eventId, getMessageEvents, events } = this.props;
    this.setState({ selectedId: eventId });

    getMessageEvents({
      message_ids: messageId,
      from: format(subDays(Date.now(), 10), 'YYYY-MM-DDTHH:MM')
    });
  }

  createRows = () => {
    const { events } = this.props;
    const { selectedId } = this.state;

    return events.map((event) => ({ selected: selectedId === event.event_id, ...event }));
  }

  render() {
    const { loading, messageId, events } = this.props;

    const pageContent = loading
      ? <Loading />
      : (
        <Grid>
          <Grid.Column xs={6}>
            <Panel sectioned title='Message Details'>

            </Panel>
            <Panel>
              <TableCollection
                headerComponent={MessageTableHeader}
                rows={this.createRows()}
                getRowData={getMessageRowData}
                selectedId={this.state.selectedId}
                pagination={false}
              />
            </Panel>
          </Grid.Column>
          <Grid.Column xs={6}>
            <Panel sectioned title='Event Details'></Panel>
          </Grid.Column>
        </Grid>
      );

    return (
      <Page title={`Message: ${messageId}`} breadcrumbAction={breadcrumbAction}>
        {pageContent}
      </Page>
    )
  }
}

const mapStateToProps = (state, props) => {
  const events = selectMessageEvents(state);

  return {
    events: events,
    loading: state.messageEvents.pending,
    messageId: props.match.params.messageId,
    eventId: props.match.params.eventId
  };
};

export default withRouter(connect(mapStateToProps, { getMessageEvents })(MessagePage));
