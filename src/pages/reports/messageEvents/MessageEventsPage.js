import React, { Component } from 'react';
import { connect } from 'react-redux';
import { snakeToFriendly } from 'src/helpers/string';
import { Page } from '@sparkpost/matchbox';
import { PanelLoading, TableCollection, ApiErrorBanner, Empty } from 'src/components';
import DisplayDate from './components/DisplayDate';
import MessageEventsSearch from './components/MessageEventsSearch';
import ViewDetailsButton from './components/ViewDetailsButton';
import { getMessageEvents, changePage } from 'src/actions/messageEvents';
import { selectMessageEvents } from 'src/selectors/messageEvents';
import CollectionControls from 'src/components/collection/CollectionControls';
import { DEFAULT_PER_PAGE_BUTTONS } from 'src/constants';
import CursorPaging from './components/CursorPaging';
import _ from 'lodash';

const errorMsg = 'Sorry, we seem to have had some trouble loading your message events.';
const emptyMessage = 'There are no message events for your current query';

const columns = [
  { label: 'Time', sortKey: 'timestamp' },
  { label: 'Event', sortKey: 'type' },
  { label: 'Recipient', sortKey: 'rcpt_to' },
  { label: 'Friendly From', sortKey: 'friendly_from' },
  null
];

export class MessageEventsPage extends Component {

  state = {
    currentPage: 1,
    perPage: 25
  }

  componentDidUpdate(prevProps) {
    const { search, getMessageEvents } = this.props;
    const { perPage } = this.state;
    //Refresh the page & load new data if the search filters have changed
    if (!_.isEqual(prevProps.search, search)) {
      this.setState({ currentPage: 1 });
      getMessageEvents({ perPage, ...search });
    }
  }

  handlePageChange = (currentPage) => {
    this.setState({ currentPage });
    const { changePage } = this.props;
    return changePage(currentPage);
  }

  handlePerPageChange = (perPage) => {
    const { search, getMessageEvents } = this.props;
    this.setState({ perPage, currentPage: 1 });
    getMessageEvents({ perPage, ...search });
  }

  //Reload the first page w/ api call, NOT from cache
  handleFirstPage = () => {
    const { search, getMessageEvents } = this.props;
    const { perPage } = this.state;
    this.setState({ currentPage: 1 });
    getMessageEvents({ perPage, ...search });
  }

  isPreviousDisabled = () => {
    const { currentPage } = this.state;
    return currentPage <= 1;
  }

  isNextDisabled = () => {
    const { hasMorePagesAvailable } = this.props;
    return !hasMorePagesAvailable;
  }

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
    const { events, empty, loading, totalCount } = this.props;
    const { currentPage, perPage } = this.state;

    if (loading) {
      return <PanelLoading />;
    }

    const content = empty
      ? <Empty message={emptyMessage} />
      : (
        <div>
          <TableCollection
            columns={columns}
            rows={events}
            getRowData={this.getRowData}
            defaultSortColumn='timestamp'
            defaultSortDirection='desc'
          />
          <CursorPaging
            currentPage={currentPage}
            handlePageChange = {this.handlePageChange}
            previousDisabled={this.isPreviousDisabled()}
            nextDisabled={this.isNextDisabled()}
            handleFirstPage={this.handleFirstPage}
            perPage={perPage}
            totalCount={totalCount}
          />
          <CollectionControls
            totalCount={totalCount}
            data={events}
            onPerPageChange={this.handlePerPageChange}
            perPageButtons={DEFAULT_PER_PAGE_BUTTONS}
            perPage={perPage}
            saveCsv={true}
          />
        </div>
      );

    return content;
  }

  render() {
    const { error } = this.props;

    return (
      <Page title='Events Search'>
        <MessageEventsSearch />
        {error ? this.renderError() : this.renderCollection()}
      </Page>
    );
  }

}

const mapStateToProps = (state) => {
  const events = selectMessageEvents(state);
  const { messageEvents } = state;
  const { loading, error, search, totalCount, hasMorePagesAvailable } = messageEvents;
  return {
    events: events,
    loading,
    error,
    empty: events.length === 0,
    search,
    totalCount,
    hasMorePagesAvailable
  };
};

export default connect(mapStateToProps, { getMessageEvents, changePage })(MessageEventsPage);
