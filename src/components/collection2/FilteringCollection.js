import React, { Component, Fragment } from 'react';
import { Panel, TextField } from '@sparkpost/matchbox';
import { Search } from '@sparkpost/matchbox-icons';
import PaginatingCollection from './PaginatingCollection';
import TableCollectionView from './TableCollectionView';
import _ from 'lodash';

const DEBOUNCE_FILTER_MS = 300;

const FilterBox = ({ onChange }) => <Panel sectioned>
  <TextField
    prefix={<Search />}
    onChange={(e) => onChange(e.target.value)}
  />
</Panel>;

export class FilteringCollection extends Component {
  state = {}

  static getDerivedStateFromProps(props, state) {
    if (state.rows) {
      return null;
    }

    // If we're given rows on mounth, use them
    return {
      rows: props.rows,
      rowCount: props.rowCount || (props.rows ? props.rows.length : 0),
      pattern: ''
    };
  }

  componentDidMount() {
    if (!this.state.rows) {
      this.handleFilterChange('');
    }
  }

  handleFilterChange = (pattern) => {
    this.setState({ rows: null, pattern });
    return Promise.resolve(this.props.fetchRows({ pattern }))
      .then(({ rows, rowCount }) => this.setState({ rows, rowCount }));
  };

  debouncedHandleFilterChange = _.debounce(this.handleFilterChange, DEBOUNCE_FILTER_MS);

  fetchFiltered = (filters) => this.props.fetchRows({
    pattern: this.state.pattern,
    ...filters
  })

  render() {
    const { collectionComponent: Coll = TableCollectionView } = this.props;
    const { rows, rowCount } = this.state;
    return <Fragment>
      <FilterBox onChange={this.debouncedHandleFilterChange} />
      {rows && <Coll {...this.props} rows={rows} rowCount={rowCount} fetchRows={this.fetchFiltered} />}
    </Fragment>;
  }
}

export const FilteringPaginatingCollection = ({ collectionComponent, ...rest }) => <FilteringCollection
  collectionComponent={(props) => <PaginatingCollection {...props} collectionComponent={collectionComponent} />}
  {...rest} />;
