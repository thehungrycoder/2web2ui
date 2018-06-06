import React, { Component } from 'react';
import { TextField } from '@sparkpost/matchbox';
import { connectSearchBox } from 'react-instantsearch/connectors';

export class AlgoliaSearch extends Component {
  // Must track user entered text to control the display
  state = {
    searchText: ''
  }

  componentDidMount() {
    this.refineSearch();
  }

  componentDidUpdate(prevProps, prevState) {
    const hasDefaultSearchTextChanged = prevProps.defaultSearchText !== this.props.defaultSearchText;
    const hasSearchTextChanged = prevState.searchText !== this.state.searchText;

    if (hasDefaultSearchTextChanged || hasSearchTextChanged) {
      this.refineSearch();
    }
  }

  handleChange = (event) => {
    this.setState({ searchText: event.currentTarget.value });
  }

  // Use default search text when user does not provide search text
  refineSearch() {
    const nextSearchText = this.state.searchText.trim() === ''
      ? this.props.defaultSearchText
      : this.state.searchText;

    // Will only make a network request when value changes
    this.props.refine(nextSearchText);
  }

  render() {
    return (
      <TextField
        onChange={this.handleChange}
        placeholder="Have a question?  Ask or enter a search term here."
        value={this.state.searchText}
      />
    );
  }
}

export default connectSearchBox(AlgoliaSearch);
