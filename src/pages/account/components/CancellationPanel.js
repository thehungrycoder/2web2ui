import React from 'react';
import { connect } from 'react-redux';
import { Panel, UnstyledLink } from '@sparkpost/matchbox';
import { openSupportTicketForm } from 'src/actions/support';

export class CancellationPanel extends React.Component {
  requestCancellation = () => {
    this.props.openSupportTicketForm({ issueId: 'account_cancellation' });
  }

  render() {
    return (
      <Panel sectioned title="Request Account Cancellation">
        <p>
          To cancel your SparkPost account, {
            <UnstyledLink onClick={this.requestCancellation}>
              submit a cancellation request
            </UnstyledLink>
          }. The request may take a few days to process.  All your data (e.g. domains, users, etc.)
          will be permanently deleted. We're sorry to see you go!
        </p>
      </Panel>
    );
  }
}

export default connect(undefined, { openSupportTicketForm })(CancellationPanel);
