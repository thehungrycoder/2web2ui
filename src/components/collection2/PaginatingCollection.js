import React, { Component, Fragment } from 'react';
import qs from 'query-string';
import { withRouter } from 'react-router-dom';
import TableCollectionView from './TableCollectionView';
import Pagination from './Pagination';

export class PaginatingCollection extends Component {
  state = {}

  static defaultProps = {
    defaultPerPage: 25
  }

  updateRows() {
    const { currentPage, perPage } = this.state;
    this.setState({ rows: null });
    return Promise.resolve(this.props.fetchRows({ currentPage, perPage }))
      .then(({ rows, rowCount }) => this.setState({ rows, rowCount }));
  }

  pageParamsChanged() {
    this.maybeUpdateQueryString();
    this.updateRows();
  }

  static getDerivedStateFromProps(props, state) {
    if (state.rows) {
      return null;
    }

    // If we're given rows on mount, use those to start with
    return {
      rows: props.rows,
      rowCount: props.rowCount || (props.rows ? props.rows.length : 0),
      perPage: props.defaultPerPage,
      currentPage: Number(qs.parse(props.location.search).page) || 1
    };
  }

  componentDidMount() {
    if (!this.state.rows) {
      // Load rows if none provided by the parent
      this.updateRows();
    }
  }

  handlePageChange = (index) => {
    const currentPage = index + 1;
    // Guard against Matchbox's Pagination component calling onChange on mount.
    if (this.state.currentPage !== currentPage) {
      this.setState({ currentPage }, this.pageParamsChanged);
    }
  }

  handlePerPageChange = (perPage) => {
    this.setState({ perPage, currentPage: 1 }, this.pageParamsChanged);
  }

  maybeUpdateQueryString() {
    const { location, updateQueryString } = this.props;
    if (updateQueryString === false) {
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

  renderPagination() {
    const { perPageButtons } = this.props;
    const { rowCount, currentPage, perPage } = this.state;

    return <Pagination
      saveCsv={false}
      rowCount={rowCount}
      perPage={perPage}
      currentPage={currentPage}
      perPageButtons={perPageButtons}
      onPageChange={this.handlePageChange}
      onPerPageChange={this.handlePerPageChange}
    />;
  }

  render() {
    const { collectionComponent: Coll = TableCollectionView } = this.props;
    return <Fragment>
      <Coll {...this.props} rows={this.state.rows} />
      {this.renderPagination()}
    </Fragment>;
  }
}

export default withRouter(PaginatingCollection);
