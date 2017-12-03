import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Page, Tabs , Panel } from '@sparkpost/matchbox';

import FilterForm from './components/FilterForm';
import EmailSearch from './components/EmailSearch';
import Results from './components/Results';

const primaryAction = {
  content: 'Add Suppressions',
  Component: Link
  // to: '/lists/suppressions/upload'
};

const tabs = [
  {
    content: 'Filters'
  },
  {
    content: 'Find by Email'
  }
];

export class ListPage extends Component {
  state = {
    selectedTab: 0
  };

  renderFilters() {
    return <FilterForm />;
  }

  renderFindByEmails() {
    return <EmailSearch />;
  }

  handleTabs(tabIdx) {
    this.setState({ selectedTab: tabIdx });
  }

  render() {
    const { selectedTab, results } = this.state;
    return (
        <Page
          title='Suppressions'
          primaryAction={primaryAction}
         >
          <Tabs
          selected={selectedTab}
          connectBelow={false}
          tabs={tabs.map(({ content }, idx) => ({ content, onClick: () => this.handleTabs(idx) }))}
          />

          <Panel className='AA'>
            <Panel.Section>
              { selectedTab === 1 ? this.renderFindByEmails() : this.renderFilters() }
            </Panel.Section>

            <Panel.Section>
              <Results results={results}/>
            </Panel.Section>
          </Panel>
        </Page>
    );
  }
}

export default connect(null, {})(ListPage);
