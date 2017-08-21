import React, { Component } from 'react';
import qs from 'query-string';
import { withRouter } from 'react-router-dom';
import Pagination from './Pagination';

const PassThroughWrapper = (props) => props.children;

class Collection extends Component {
  state = {};

  componentDidMount() {
    const { defaultPerPage = 25, location } = this.props;
    this.setState({
      perPage: defaultPerPage,
      currentPage: qs.parse(location.search).page || 1
    });
  }

  handlePageChange = (index) => {
    const currentPage = index + 1;
    this.setState({ currentPage }, this.maybeUpdateQueryString);
  }

  handlePerPageChange = (perPage) => {
    const currentPage = 1;
    this.setState({ perPage, currentPage }, this.maybeUpdateQueryString);
  }

  maybeUpdateQueryString() {
    const { currentPage, perPage } = this.state;
    const { search, pathname } = this.props.location;
    const parsed = qs.parse(search);
    if (parsed.page || this.props.updateQueryString) {
      const updated = Object.assign(parsed, { page: currentPage, perPage });
      this.props.history.push(`${pathname}?${qs.stringify(updated)}`);
    }
  }

  getVisibleRows() {
    const { perPage, currentPage } = this.state;
    const { rows } = this.props;
    const currentIndex = (currentPage - 1) * perPage;
    return rows.slice(currentIndex, currentIndex + perPage);
  }

  renderPagination() {
    const { rows, perPageButtons, pagination } = this.props;
    const { currentPage, perPage } = this.state;

    if (!pagination || !currentPage) { return null; }

    return (
      <Pagination
        data={rows}
        perPage={perPage}
        currentPage={currentPage}
        perPageButtons={perPageButtons}
        onPageChange={this.handlePageChange}
        onPerPageChange={this.handlePerPageChange}
      />
    );
  }

  render() {
    const {
      rowComponent: RowComponent,
      rowKeyName = 'id',
      headerComponent: HeaderComponent,
      outerWrapper: OuterWrapper = PassThroughWrapper,
      bodyWrapper: BodyWrapper = PassThroughWrapper
    } = this.props;

    return (
      <div>
        <OuterWrapper>
          <HeaderComponent />
          <BodyWrapper>
            {this.getVisibleRows().map((row, i) => <RowComponent key={row[rowKeyName] || i} {...row} />)}
          </BodyWrapper>
        </OuterWrapper>
        {this.renderPagination()}
      </div>
    );
  }
}

export default withRouter(Collection);
