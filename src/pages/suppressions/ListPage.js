import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Page, Tabs , Panel } from '@sparkpost/matchbox';
import { searchRecipient } from 'src/actions/suppressions';
import { list as listSubaccounts } from 'src/actions/subaccounts';
import { hasSubaccounts } from 'src/selectors/subaccounts';
import SuppressionSearch from './components/SuppressionSearch';
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

  handleTabs (tabIdx) {
    this.setState({ selectedTab: tabIdx });
  }

  componentDidMount () {
    const { hasSubaccounts, listSubaccounts } = this.props;
    if (hasSubaccounts) {
      listSubaccounts();
    }
  }

  render () {
    const { selectedTab } = this.state;
    const { list, hasSubaccounts, searchRecipient } = this.props;

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
            {selectedTab === 1
              ? <EmailSearch onSubmit={searchRecipient} hasSubaccounts={hasSubaccounts} />
              : <SuppressionSearch />
            }
          </Panel.Section>
        </Panel>
        <Results results={list} {...this.props} />
      </Page>
    );
  }
}

const mapStateToProps = (state) => {
  const { listLoading, list, deleting, nextPage, totalCount, search } = state.suppressions;
  return {
    loading: listLoading,
    list,
    nextPage,
    totalCount,
    search,
    hasSubaccounts: hasSubaccounts(state),
    subaccounts: state.subaccounts.list,
    deleting
  };
};

export default connect(mapStateToProps, { searchRecipient, listSubaccounts })(ListPage);
