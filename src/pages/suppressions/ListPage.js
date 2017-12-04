import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Page, Tabs , Panel } from '@sparkpost/matchbox';

import { searchRecipient, searchSuppressions } from 'src/actions/suppressions';
import { list as listSubaccounts } from 'src/actions/subaccounts';

import { hasSubaccounts } from 'src/selectors/subaccounts';

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

  handleSearchByFilters(options) {
    this.props.searchSuppressions(options);
  }

  handleSearchByEmail(options) {
    this.props.searchRecipient(options);
  }

  renderFilters() {
    return <FilterForm onSubmit={this.handleSearchByFilters.bind(this)} />;
  }

  renderFindByEmails() {
    const { subaccounts } = this.props;
    return <EmailSearch onSubmit={this.handleSearchByEmail.bind(this)} subaccounts={subaccounts} />;
  }

  handleTabs(tabIdx) {
    this.setState({ selectedTab: tabIdx });
  }

  componentDidMount() {
    if (this.props.hasSubaccounts) {
      this.props.listSubaccounts();
    }
    this.handleSearchByEmail({ email: '06bvm995wxn@msn.com' }); //TODO remove this
  }

  render() {
    const { selectedTab } = this.state;
    const { loading, results, subaccounts, hasSubaccounts } = this.props;

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
              <Results results={results} loading={loading} subaccounts={subaccounts} hasSubaccounts={hasSubaccounts}/>
            </Panel.Section>
          </Panel>
        </Page>
    );
  }
}

const mapStateToProps = (state) => {
  const { loading, resultsSet } = state.suppressions;
  return {
    loading: loading,
    results: resultsSet,
    hasSubaccounts: hasSubaccounts(state),
    subaccounts: state.subaccounts.list
  };
};
export default connect(mapStateToProps, { searchSuppressions, searchRecipient, listSubaccounts })(ListPage);
