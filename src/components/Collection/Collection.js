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
    const { updateQueryString = false } = this.props;
    const currentPage = index + 1;
    this.setState({ currentPage });

    if (updateQueryString) {
      const { search, pathname } = this.props.location;
      const parsed = qs.parse(search);
      parsed.page = currentPage;
      this.props.history.push(`${pathname}?${qs.stringify(parsed)}`);
    }
  }

  handlePerPageChange = (perPage) => {
    const { updateQueryString = false } = this.props;
    this.setState({ perPage, currentPage: 1 });

    if (updateQueryString) {
      const { search, pathname } = this.props.location;
      const parsed = qs.parse(search);
      parsed.perPage = perPage;
      this.props.history.push(`${pathname}?${qs.stringify(parsed)}`);
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

  render() {
    const { rowData, rowComponent: RowComponent, rowKeyName, perPageButtons = [10, 25, 50]} = this.props;
    const { currentPage, perPage } = this.state;

    if (!currentPage) {
      return null;
    }

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
}

export default withRouter(Collection);
