import React from 'react';
import { UnstyledLink, Icon } from '@sparkpost/matchbox';
import { Snippet } from 'react-instantsearch/dom';

const AlgoliaResults = ({ hit }) => (
  <div>
    <strong><Icon name='Link' /><UnstyledLink to={hit.permalink}>{hit.post_title}</UnstyledLink></strong>
    <div><Snippet tagName="b" attribute="post_excerpt" hit={hit} /></div>
  </div>
);

export default AlgoliaResults;
