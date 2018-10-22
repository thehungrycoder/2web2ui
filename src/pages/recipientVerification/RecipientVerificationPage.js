import React, { Component } from 'react';
import { connect } from 'react-redux';

import { withRouter } from 'react-router-dom';

import { Page, Tabs, Panel } from '@sparkpost/matchbox';
import { ApiErrorBanner } from 'src/components';

import { createRecipientVerificationList } from 'src/actions/recipientVerificationLists';
import { showAlert } from 'src/actions/globalAlert';

import RecipientVerificationListForm from './components/RecipientVerificationListForm';
import SingleAddressForm from './components/SingleAddressForm';

const tabs = [
  {
    content: 'Verify A List'
  },
  {
    content: 'Verify a Single Address'
  }
];
export class RecipientVerificationPage extends Component {
  state = {
    selectedTab: 0
  };

  handleTabs(tabIdx) {
    this.setState({ selectedTab: tabIdx });
  }

  createRecipientVerificationList = (values) => {
    const { createRecipientVerificationList, showAlert, history } = this.props;

    return createRecipientVerificationList(values).then(() => {
      showAlert({
        type: 'success',
        message: 'Created Recipient Email Verification List'
      });
      history.push('/recipient-verification');
    });
  };

  render() {

    const { selectedTab } = this.state;

    return <Page
      title='Recipient Email Verification'>
      <Tabs
        selected={selectedTab}
        connectBelow={true}
        tabs={tabs.map(({ content }, idx) => ({ content, onClick: () => this.handleTabs(idx) }))}
      />
      <Panel>
        <Panel.Section>
          {selectedTab === 1
            ? <SingleAddressForm />
            : <RecipientVerificationListForm onSubmit={this.createRecipientVerificationList} />
          }
        </Panel.Section>
      </Panel>
    </Page>;
  }
}

const mapDispatchToProps = {
  createRecipientVerificationList,
  showAlert
};

export default withRouter(connect(undefined, mapDispatchToProps)(RecipientVerificationPage));
