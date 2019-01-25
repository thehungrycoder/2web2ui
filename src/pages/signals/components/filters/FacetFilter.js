import React from 'react';
import { Select, TextField } from '@sparkpost/matchbox';
import { Search } from '@sparkpost/matchbox-icons';
import { onEnter } from 'src/helpers/keyEvents';
import facets from '../../constants/facets';
import withSignalOptions from '../../containers/withSignalOptions';
import styles from './FacetFilter.module.scss';

const OPTIONS = [
  { label: 'No Breakdown', value: '' },
  ...facets.map(({ key, label }) => ({ label: `By ${label}`, value: key }))
];

export class FacetFilter extends React.Component {
  state = {
    prevFacetSearchTerm: '',
    searchTerm: ''
  }

  // note, hydrate searchTerm from signalOptions
  static getDerivedStateFromProps(props, state) {
    const facetSearchTerm = props.signalOptions.facetSearchTerm || '';

    return {
      prevFacetSearchTerm: facetSearchTerm,
      searchTerm: state.prevFacetSearchTerm !== facetSearchTerm ? facetSearchTerm : state.searchTerm
    };
  }

  handleFacetChange = (event) => {
    const { changeSignalOptions } = this.props;
    changeSignalOptions({ facet: event.currentTarget.value, facetSearchTerm: '' });
    this.setState({ searchTerm: '' });
  }

  handleFacetSearch = () => {
    const { changeSignalOptions } = this.props;
    changeSignalOptions({ facetSearchTerm: this.state.searchTerm });
  }

  handleSearchChange = (event) => {
    this.setState({ searchTerm: event.currentTarget.value });
  }

  render() {
    const { signalOptions: { facet }} = this.props;
    const { searchTerm } = this.state;

    return (
      <React.Fragment>
        <div className={styles.FacetFilter}>
          <Select
            onChange={this.handleFacetChange}
            options={OPTIONS}
            value={facet}
          />
        </div>
        {facet && (
          <div className={styles.FacetFilter}>
            <TextField
              onChange={this.handleSearchChange}
              onKeyPress={onEnter(this.handleFacetSearch)}
              placeholder="Search here"
              suffix={<Search />}
              value={searchTerm}
            />
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default withSignalOptions(FacetFilter);
