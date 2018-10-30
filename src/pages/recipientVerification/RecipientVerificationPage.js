import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Page, Tabs, Panel } from '@sparkpost/matchbox';
import RecipientVerificationListForm from './components/RecipientVerificationListForm';
import SingleAddressForm from './components/SingleAddressForm';
import ListResults from './components/ListResults';

const tabs = [
  { content: 'Verify A List' },
  { content: 'Verify a Single Address' }
];

export class RecipientVerificationPage extends Component {
  state = {
    selectedTab: 0
  };

  handleTabs(tabIdx) {
    this.setState({ selectedTab: tabIdx });
  }

  render() {
    const { selectedTab } = this.state;

    return (
      <Page
        title='Recipient Email Verification'>
        <Tabs
          selected={selectedTab}
          connectBelow={true}
          tabs={tabs.map(({ content }, idx) => ({ content, onClick: () => this.handleTabs(idx) }))}
        />
        <Panel>
          <Panel.Section>
            {selectedTab === 1 ? <SingleAddressForm /> : <RecipientVerificationListForm />}
          </Panel.Section>
        </Panel>
        {selectedTab === 0 && <ListResults />}
      </Page>
    );
  }
}

export default connect(undefined)(RecipientVerificationPage);
