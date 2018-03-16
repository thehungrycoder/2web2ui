import React from 'react';
import { UnstyledLink, Icon } from '@sparkpost/matchbox';

const AlgoliaResults = ({ results }) => (
  <ul>
    {results.map((item) => (<li>
      <strong><Icon name='Link' /><UnstyledLink to={item.permalink}>{item.post_title}</UnstyledLink></strong>
      <div dangerouslySetInnerHTML={({ __html: item.post_excerpt })} />
    </li>))}
  </ul>
);

export default AlgoliaResults;
