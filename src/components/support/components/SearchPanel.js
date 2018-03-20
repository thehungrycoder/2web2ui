import React, { Component } from 'react';
import { Button, Panel } from '@sparkpost/matchbox';
import AlgoliaResults from './AlgoliaResults';
import styles from './SearchPanel.module.scss';
import { InstantSearch, Hits } from 'react-instantsearch/dom';
import AlgoliaSearch from './AlgoliaSearch.js';
import config from 'src/config';
const searchCfg = config.support.algolia;

export class SearchPanel extends Component {
  render() {
    const { toggleForm } = this.props;

    return <InstantSearch
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
        <span>Do you need more assistance?</span>
        <Button primary onClick={toggleForm} className={styles.ToggleButton}>
          Submit a Ticket
        </Button>
      </Panel.Section>
    </InstantSearch>;
  }
}

