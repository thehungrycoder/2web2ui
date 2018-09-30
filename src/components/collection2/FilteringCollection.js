import React, { Component, Fragment } from 'react';
import { Panel, TextField } from '@sparkpost/matchbox';
import { Search } from '@sparkpost/matchbox-icons';
import PaginatingCollection from './PaginatingCollection';
import _ from 'lodash';

const FilterBox = ({ onChange }) => <Panel sectioned>
  <TextField
    prefix={<Search />}
    onChange={(e) => onChange(e.target.value)}
  />
</Panel>;

export class FilteringCollection extends Component {
  state = {}

  componentDidMount() {
    if (!this.state.rows) {
      this.handleFilterChange('');
    }
  }

  handleFilterChange = (pattern) => {
    this.setState({ rows: null, pattern },
      () => Promise.resolve(this.props.fetchRows({ pattern }))
        .then(({ rows, rowCount }) => this.setState({ rows, rowCount })));
  };

  debouncedHandleFilterChange = _.debounce(this.handleFilterChange, 300);

  fetchFiltered = (filters) => this.props.fetchRows({
    pattern: this.state.pattern,
    ...filters
  })

  render() {
    const { collectionComponent: Coll } = this.props;
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
