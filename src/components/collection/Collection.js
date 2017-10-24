import React, { Component } from 'react';
import CollectionPropTypes from './Collection.propTypes';
import qs from 'query-string';
import _ from 'lodash';
import { withRouter } from 'react-router-dom';
import Pagination, { defaultPerPageButtons } from './Pagination';
import CollectionFilter from './Filter';
import { objectSortMatch } from 'src/helpers/sortMatch';

const PassThroughWrapper = (props) => props.children;
const NullComponent = () => null;
const objectValuesToString = (keys) => (item) => (keys || Object.keys(item)).map((key) => item[key]).join(' ');

export class _Collection extends Component {
  state = {};

  componentDidMount() {
    const { defaultPerPage = 25, location } = this.props;
    this.setState({
      perPage: defaultPerPage,
      currentPage: Number(qs.parse(location.search).page) || 1
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
    const { keyMap, itemToStringKeys } = filterBox;
    const update = {
      currentPage: 1,
      filteredRows: null
    };

    if (pattern) {
      update.filteredRows = objectSortMatch({
        items: rows,
        pattern,
        getter: objectValuesToString(itemToStringKeys),
        keyMap
      });
    }

    this.setState(update);
  }, 300);

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
    const { filterBox = {}, rows, perPageButtons = defaultPerPageButtons } = this.props;
    if (filterBox.show && (rows.length > Math.min(...perPageButtons))) {
      return <CollectionFilter {...filterBox} rows={rows} onChange={this.handleFilterChange} />;
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
      headerComponent: HeaderComponent = NullComponent,
      outerWrapper: OuterWrapper = PassThroughWrapper,
      bodyWrapper: BodyWrapper = PassThroughWrapper
    } = this.props;

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

_Collection.propTypes = CollectionPropTypes;

export default withRouter(_Collection);
