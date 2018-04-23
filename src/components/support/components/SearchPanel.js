import React from 'react';
import { Panel } from '@sparkpost/matchbox';
import AlgoliaResults from './AlgoliaResults';
import styles from './SearchPanel.module.scss';
import { InstantSearch, Hits } from 'react-instantsearch/dom';
import SupportCta from './SupportCta';
import AlgoliaSearch from './AlgoliaSearch.js';
import config from 'src/config';
const searchCfg = config.support.algolia;

export const SearchPanel = ({ toggleForm }) => (
  <InstantSearch
    appId={searchCfg.appID}
    apiKey={searchCfg.apiKey}
    indexName={searchCfg.index}
  >
    <Panel.Section>
      <AlgoliaSearch />
    </Panel.Section>
    <Panel.Section className={styles.Results}>
      <Hits hitComponent={AlgoliaResults} />
    </Panel.Section>
    <Panel.Section>
      <SupportCta toggleForm={toggleForm} />
    </Panel.Section>
  </InstantSearch>
);
