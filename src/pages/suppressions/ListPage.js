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

  handleSearchByEmail = (options) => {
    this.props.searchRecipient(options);
  }

  renderFilters() {
    return <FilterForm onSubmit={this.props.searchSuppressions} />;
  }

  renderFindByEmails() {
    const { subaccounts, hasSubaccounts } = this.props;
    return <EmailSearch onSubmit={this.handleSearchByEmail} subaccounts={subaccounts} hasSubaccounts={hasSubaccounts} />;
  }

  handleTabs(tabIdx) {
    this.setState({ selectedTab: tabIdx });
  }

  componentDidMount() {
    const { reportFilters } = this.props;
    if (this.props.hasSubaccounts) {
      this.props.listSubaccounts();
    }
    this.props.searchSuppressions({ reportFilters });
  }

  render() {
    const { selectedTab } = this.state;
    const { loading, list, subaccounts, hasSubaccounts } = this.props;

    return (
      <Page
        title='Suppressions'
        primaryAction={primaryAction}
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
        <Results results={list} loading={loading} subaccounts={subaccounts} hasSubaccounts={hasSubaccounts}/>
      </Page>
    );
  }
}

const mapStateToProps = (state) => {
  const { listLoading, list } = state.suppressions;
  return {
    reportFilters: state.reportFilters,
    loading: listLoading,
    list: list,
    hasSubaccounts: hasSubaccounts(state),
    subaccounts: state.subaccounts.list
  };
};

export default connect(mapStateToProps, { searchSuppressions, searchRecipient, listSubaccounts })(ListPage);
