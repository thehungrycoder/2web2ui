import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Panel } from '@sparkpost/matchbox';
import AlgoliaResults from './AlgoliaResults';
import styles from './SearchPanel.module.scss';
import { InstantSearch, Hits } from 'react-instantsearch/dom';
import SupportCta from './SupportCta';
import AlgoliaSearch from './AlgoliaSearch.js';
import { selectSupportIssues } from 'src/selectors/support';
import config from 'src/config';
const searchCfg = config.support.algolia;

const SearchPanel = ({ toggleForm, issues }) => {
  const canSubmitSupportTicket = issues.length > 0;
  return (
    <InstantSearch
      appId={searchCfg.appID}
      apiKey={searchCfg.apiKey}
      indexName={searchCfg.index}
    >
      <Panel.Section>
        <AlgoliaSearch />
      </Panel.Section>
      <Panel.Section className={classnames(styles.Results, canSubmitSupportTicket && styles.shorten)}>
        <Hits hitComponent={AlgoliaResults} />
      </Panel.Section>
      {canSubmitSupportTicket && (
        <Panel.Section>
          <SupportCta toggleForm={toggleForm} />
        </Panel.Section>
      )}
    </InstantSearch>
  );
};

const mapStateToProps = (state) => ({
  issues: selectSupportIssues(state)
});

export default connect(mapStateToProps, {})(SearchPanel);
