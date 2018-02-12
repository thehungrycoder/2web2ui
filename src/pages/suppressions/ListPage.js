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

  handleSearchByEmail = (options) => {
    this.props.searchRecipient(options);
  }

  renderFilters() {
    return <FilterForm onSubmit={this.props.searchSuppressions} />;
  }

  renderFindByEmails() {
    const { hasSubaccounts } = this.props;
    return <EmailSearch onSubmit={this.handleSearchByEmail} hasSubaccounts={hasSubaccounts} />;
  }

  handleTabs(tabIdx) {
    this.setState({ selectedTab: tabIdx });
  }

  componentDidMount() {
    const { reportFilters, hasSubaccounts, searchSuppressions, listSubaccounts } = this.props;
    if (hasSubaccounts) {
      listSubaccounts();
    }
    searchSuppressions({ reportFilters });
  }

  render() {
    const { selectedTab } = this.state;
    const { loading, deleting, list, subaccounts, hasSubaccounts } = this.props;

    return (
      <Page
        title='Suppressions'
        primaryAction={{
          Component: Link,
          content: 'Add Suppressions',
          to: '/lists/suppressions/create'
        }}
      >
        <Tabs
          selected={selectedTab}
          connectBelow={true}
          tabs={tabs.map(({ content }, idx) => ({ content, onClick: () => this.handleTabs(idx) }))}
        />

        <Panel>
          <Panel.Section>
            { selectedTab === 1 ? this.renderFindByEmails() : this.renderFilters() }
          </Panel.Section>
        </Panel>
        <Results results={list} loading={loading} deleting={deleting} subaccounts={subaccounts} hasSubaccounts={hasSubaccounts}/>
      </Page>
    );
  }
}

const mapStateToProps = (state) => {
  const { listLoading, list, deleting } = state.suppressions;
  return {
    reportFilters: state.reportFilters,
    loading: listLoading,
    list,
    hasSubaccounts: hasSubaccounts(state),
    subaccounts: state.subaccounts.list,
    deleting
  };
};

export default connect(mapStateToProps, { searchSuppressions, searchRecipient, listSubaccounts })(ListPage);
