/* eslint max-lines: ["error", 200] */
import React, { Component } from 'react';
import CollectionPropTypes from './Collection.propTypes';
import qs from 'query-string';
import _ from 'lodash';
import { withRouter } from 'react-router-dom';
import Pagination from './Pagination';
import { DEFAULT_PER_PAGE_BUTTONS } from 'src/constants';
import FilterBox from './FilterBox';
import { objectSortMatch } from 'src/helpers/sortMatch';

const PassThroughWrapper = (props) => props.children;
const NullComponent = () => null;
const objectValuesToString = (keys) => (item) => (keys || Object.keys(item)).map((key) => item[key]).join(' ');

export class Collection extends Component {
  state = {};

  static defaultProps = {
    defaultPerPage: 25,
    filterBox: {
      show: false
    }
  }

  componentDidMount() {
    const { defaultPerPage, location } = this.props;
    this.setState({
      perPage: defaultPerPage,
      currentPage: Number(qs.parse(location.search).page) || 1
    });
  }

  componentDidUpdate(prevProps) {
    // re-calculate filtered results if the incoming
    // row data has changed
    if (this.props.rows !== prevProps.rows) {
      this.handleFilterChange(this.state.pattern);
    }
  }

  handlePageChange = (index) => {
    const currentPage = index + 1;
    this.setState({ currentPage }, this.maybeUpdateQueryString);
  }

  handlePerPageChange = (perPage) => {
    this.setState({ perPage, currentPage: 1 }, this.maybeUpdateQueryString);
  }

  handleFilterChange = (pattern) => {
    const { rows, filterBox, sortColumn, sortDirection } = this.props;
    const { keyMap, itemToStringKeys, matchThreshold } = filterBox;
    const update = {
      currentPage: 1,
      filteredRows: null,
      pattern
    };

    if (pattern) {
      const filteredRows = objectSortMatch({
        items: rows,
        pattern,
        getter: objectValuesToString(itemToStringKeys),
        keyMap,
        matchThreshold
      });

      // Ultimately respect the sort column, if present
      if (sortColumn) {
        update.filteredRows = _.orderBy(filteredRows, sortColumn, sortDirection || 'asc');
      } else {
        update.filteredRows = filteredRows;
      }
    }

    this.setState(update);
  };

  debouncedHandleFilterChange = _.debounce(this.handleFilterChange, 300);

  maybeUpdateQueryString() {
    const { location, pagination, updateQueryString } = this.props;
    if (!pagination || updateQueryString === false) {
      return;
    }
    const { currentPage, perPage } = this.state;
    const { search, pathname } = location;
    const parsed = qs.parse(search);
    if (parsed.page || updateQueryString) {
      const updated = Object.assign(parsed, { page: currentPage, perPage });
      this.props.history.push(`${pathname}?${qs.stringify(updated)}`);
    }
  }

  getVisibleRows() {
    const { perPage, currentPage, filteredRows } = this.state;
    const { rows = [], pagination } = this.props;
    if (!pagination) {
      return filteredRows || rows;
    }
    const currentIndex = (currentPage - 1) * perPage;
    return (filteredRows || rows).slice(currentIndex, currentIndex + perPage);
  }

  renderFilterBox() {
    const { filterBox, rows, perPageButtons = DEFAULT_PER_PAGE_BUTTONS } = this.props;
    if (filterBox.show && (rows.length > Math.min(...perPageButtons))) {
      return <FilterBox {...filterBox} rows={rows} onChange={this.debouncedHandleFilterChange} />;
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
      rows,
      rowComponent: RowComponent,
      rowKeyName = 'id',
      headerComponent: HeaderComponent = NullComponent,
      outerWrapper: OuterWrapper = PassThroughWrapper,
      bodyWrapper: BodyWrapper = PassThroughWrapper
    } = this.props;

    if (!rows.length) {
      return null;
    }

    return (
      <div>
        {this.renderFilterBox()}
        <OuterWrapper>
          <HeaderComponent />
          <BodyWrapper>
            {this.getVisibleRows().map((row, i) => <RowComponent key={`${row[rowKeyName] || 'row'}-${i}`} {...row} />)}
          </BodyWrapper>
        </OuterWrapper>
        {this.renderPagination()}
      </div>
    );
  }
}

Collection.propTypes = CollectionPropTypes;

export default withRouter(Collection);
