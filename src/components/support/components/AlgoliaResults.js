import React from 'react';
import { UnstyledLink } from '@sparkpost/matchbox';
import { InsertLink } from '@sparkpost/matchbox-icons';
import { Snippet } from 'react-instantsearch/dom';
import styles from './AlgoliaResults.module.scss';

const AlgoliaResults = ({ hit }) => (
  <div className={styles.Result}>
    <strong><InsertLink /> <UnstyledLink external to={hit.permalink}>{hit.post_title}</UnstyledLink></strong>
    <div><Snippet tagName="b" attribute="post_excerpt" hit={hit} /></div>
  </div>
);

export default AlgoliaResults;
