import React from 'react';
import { TextField } from '@sparkpost/matchbox';
import { connectSearchBox } from 'react-instantsearch/connectors';

const AlgoliaSearch = ({ currentRefinement, refine }) =>
  <TextField
    onChange={(e) => refine(e.currentTarget.value)}
    value={currentRefinement}
    placeholder={'Have a question?  Ask or enter a search term here.'}

  />;

const ConnectedSearchBox = connectSearchBox(AlgoliaSearch);
export default ConnectedSearchBox;

