import _ from 'lodash';
import React, { Component } from 'react';
import { TextField } from '@sparkpost/matchbox';
import { connectSearchBox } from 'react-instantsearch/connectors';

export class AlgoliaSearch extends Component {
  // Must track user entered text to control the display
  state = {
    text: ''
  }

  handleChange = ({ currentTarget }) => {
    const nextText = currentTarget.value;

    // Use default refinement when a search term is not provided
    const nextRefinement = _.trim(nextText) === ''
      ? this.props.defaultRefinement
      : nextText;

    this.setState({ text: nextText });
    this.props.refine(nextRefinement);
  };

  render() {
    return (
      <TextField
        onChange={this.handleChange}
        placeholder="Have a question?  Ask or enter a search term here."
        value={this.state.text}
      />
    );
  }
}

export default connectSearchBox(AlgoliaSearch);
