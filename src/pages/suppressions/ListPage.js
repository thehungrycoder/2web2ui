import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Page, Tabs , Panel } from '@sparkpost/matchbox';

import { searchRecipient, listSuppressions } from 'src/actions/suppressions';
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


  // handleSearchByFilters = (options) => {
  //   this.props.listSuppressions(params);
  // }

  handleSearchByEmail = (options) => {
    this.props.searchRecipient(options);
  }

  renderFilters() {
    return <FilterForm onSubmit={this.props.listSuppressions} />;
  }

  renderFindByEmails() {
    const { subaccounts, hasSubaccounts } = this.props;
    return <EmailSearch onSubmit={this.handleSearchByEmail} subaccounts={subaccounts} hasSubaccounts={hasSubaccounts} />;
  }

  handleTabs(tabIdx) {
    this.setState({ selectedTab: tabIdx });
  }

  componentDidMount() {
    if (this.props.hasSubaccounts) {
      this.props.listSubaccounts();
    }
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
          connectBelow={false}
          tabs={tabs.map(({ content }, idx) => ({ content, onClick: () => this.handleTabs(idx) }))}
          />

          <Panel>
            <Panel.Section>
              { selectedTab === 1 ? this.renderFindByEmails() : this.renderFilters() }
            </Panel.Section>

            <Panel.Section>
              <Results results={list} loading={loading} subaccounts={subaccounts} hasSubaccounts={hasSubaccounts}/>
            </Panel.Section>
          </Panel>
        </Page>
    );
  }
}

const mapStateToProps = (state) => {
  const { listLoading, list } = state.suppressions;
  return {
    loading: listLoading,
    list: list,
    hasSubaccounts: hasSubaccounts(state),
    subaccounts: state.subaccounts.list
  };
};
export default connect(mapStateToProps, { listSuppressions, searchRecipient, listSubaccounts })(ListPage);
