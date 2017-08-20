import React, { Component } from 'react';
import qs from 'query-string';
import { withRouter } from 'react-router-dom';
import Pagination from './Pagination';

const PassThroughWrapper = (props) => props.children;

class Collection extends Component {
  state = {};

  componentDidMount() {
    const { defaultPerPage = 10, location } = this.props;
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

  renderPagination() {
    const { rowData, perPageButtons, pagination } = this.props;
    const { currentPage, perPage } = this.state;

    if (!pagination || !currentPage) { return null; }

    return (
      <Pagination
        data={rowData}
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
      rowKeyName,
      header: Header,
      outerWrapper: OuterWrapper = PassThroughWrapper,
      bodyWrapper: BodyWrapper = PassThroughWrapper
    } = this.props;

    return (
      <div>
        <OuterWrapper>
          <Header />
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
