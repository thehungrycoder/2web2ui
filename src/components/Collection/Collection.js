import React, { Component } from 'react';
import { Panel, Table, Button, Pagination } from '@sparkpost/matchbox';
import qs from 'query-string';
import { withRouter } from 'react-router-dom';

class Collection extends Component {
  state = {};

  componentDidMount() {
    const { defaultPerPage = 0, location } = this.props;
    this.setState({
      perPage: defaultPerPage,
      currentPage: qs.parse(location.search).page || 1
    });
  }

  handlePageChange = (index) => {
    const currentPage = index + 1;
    this.setState({ currentPage });
    this.maybeUpdateQueryString({ currentPage });
  }

  handlePerPageChange = (perPage) => {
    const currentPage = 1;
    this.setState({ perPage, currentPage });
    this.maybeUpdateQueryString({ perPage, currentPage });
  }

  maybeUpdateQueryString(updates) {
    if (this.props.updateQueryString) {
      const { search, pathname } = this.props.location;
      const updated = Object.assign(qs.parse(search), updates);
      this.props.history.push(`${pathname}?${qs.stringify(updated)}`);
    }
  }

  getVisibleRows() {
    const { perPage, currentPage } = this.state;
    const { rowData } = this.props;
    const currentIndex = (currentPage - 1) * perPage;
    return rowData.slice(currentIndex, currentIndex + perPage);
  }

  renderHeader() {
    const { header: Header, columns = []} = this.props;
    if (Header) {
      return <Header />;
    }
    return (
      <thead>
        <Table.Row>
          {columns.map((title) => <Table.HeaderCell key={title}>{title}</Table.HeaderCell>)}
        </Table.Row>
      </thead>
    );
  }

  renderPagination() {
    const { rowData, perPageButtons = [10, 25, 50], pagination } = this.props;
    const { currentPage, perPage } = this.state;

    if (!pagination || !currentPage) { return null; }

    return (
      <div>
        <Pagination
          pages={Math.ceil(rowData.length / perPage)}
          pageRange={5}
          initialIndex={(currentPage - 1)}
          onChange={this.handlePageChange}
        />
        <Button.Group>Show:
          {perPageButtons.map((perPage) => (
            <Button key={perPage} onClick={() => this.handlePerPageChange(perPage)}>{perPage}</Button>
          ))}
        </Button.Group>
      </div>
    );
  }

  // TODO either make pagination elements depend on props.pagination or remove that prop and always have pagination
  render() {
    const { rowComponent: RowComponent, rowKeyName } = this.props;

    return (
      <div>
        <Panel>
          <Table>
            {this.renderHeader()}
            <tbody>
              {this.getVisibleRows().map((row, i) => <RowComponent key={row[rowKeyName] || i} {...row} />)}
            </tbody>
          </Table>
        </Panel>
        {this.renderPagination()}
      </div>
    );
  }
}

export default withRouter(Collection);
