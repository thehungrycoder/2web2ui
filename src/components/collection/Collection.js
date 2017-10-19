import React, { Component } from 'react';
import qs from 'query-string';
import _ from 'lodash';
import { withRouter } from 'react-router-dom';
import Pagination, { defaultPerPageButtons } from './Pagination';
import CollectionFilter from './Filter';
import { objectSortMatch } from 'src/helpers/sortMatch';

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
    this.setState({ perPage, currentPage: 1 }, this.maybeUpdateQueryString);
  }

  handleFilterChange = _.debounce((pattern) => {
    const { rows, filterBox } = this.props;
    const { keyMap, compareKeys = []} = filterBox;
    const update = {
      currentPage: 1,
      filteredRows: null
    };

    if (pattern) {
      update.filteredRows = objectSortMatch({
        items: rows,
        pattern,
        getter: (item) => compareKeys.map((key) => item[key]).join(' '),
        keyMap
      });
    }

    this.setState(update);
  }, 500);

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
    const { perPage, currentPage, filteredRows } = this.state;
    const { rows } = this.props;
    const currentIndex = (currentPage - 1) * perPage;
    return (filteredRows || rows).slice(currentIndex, currentIndex + perPage);
  }

  renderFilterBox() {
    const { filterBox = {}, rows, perPageButtons = defaultPerPageButtons } = this.props;
    if (filterBox.show && (rows.length > Math.min(...perPageButtons))) {
      return <CollectionFilter {...filterBox} onChange={this.handleFilterChange} />;
    }
    return null;
  }

  renderPagination() {
    const { rows, perPageButtons, pagination } = this.props;
    const { currentPage, perPage, filteredRows } = this.state;

    if (!pagination || !currentPage) { return null; }

    return (
      <Pagination
        data={filteredRows || rows}
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
        {this.renderFilterBox()}
        <OuterWrapper>
          <HeaderComponent />
          <BodyWrapper>
            {this.getVisibleRows().map((row, i) => <RowComponent key={`${row[rowKeyName]}-${i}`} {...row} />)}
          </BodyWrapper>
        </OuterWrapper>
        {this.renderPagination()}
      </div>
    );
  }
}

export default withRouter(Collection);
