import React from 'react';
import { InstantSearch, Hits } from 'react-instantsearch/dom';
import { Panel } from '@sparkpost/matchbox';

import AlgoliaResults from './AlgoliaResults';
import AlgoliaSearch from './AlgoliaSearch';
import config from 'src/config';
import styles from './SearchPanel.module.scss';

const searchCfg = config.support.algolia;

const SearchPanel = ({ defaultSearchText }) => (
  <InstantSearch appId={searchCfg.appID} apiKey={searchCfg.apiKey} indexName={searchCfg.index}>
    <Panel.Section>
      <AlgoliaSearch defaultSearchText={defaultSearchText} />
    </Panel.Section>
    <Panel.Section className={styles.Results}>
      <Hits hitComponent={AlgoliaResults} />
    </Panel.Section>
  </InstantSearch>
);

export default SearchPanel;
