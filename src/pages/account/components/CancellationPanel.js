import React from 'react';
import { connect } from 'react-redux';
import { Panel, UnstyledLink } from '@sparkpost/matchbox';
import { openSupportTicketForm } from 'src/actions/support';

export const CancellationPanel = (props) => {
  const requestCancellation = () => {
    props.openSupportTicketForm({ issueId: 'account_cancellation' });
  };

  return (
    <Panel sectioned title="Request Account Cancellation">
      <p>
        To cancel your SparkPost account, {
          <UnstyledLink onClick={requestCancellation}>
            submit a cancellation request
          </UnstyledLink>
        }. The request may take a few days to process.  All your data (e.g. domains, users, etc.)
        will be permanently deleted. We're sorry to see you go!
      </p>
    </Panel>
  );
};

CancellationPanel.displayName = 'CancellationPanel';

export default connect(undefined, { openSupportTicketForm })(CancellationPanel);
