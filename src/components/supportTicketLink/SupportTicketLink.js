import React from 'react';
import { connect } from 'react-redux';
import { UnstyledLink } from '@sparkpost/matchbox';
import { openSupportTicketForm } from 'src/actions/support';

export function SupportTicketLink({ children, openSupportTicketForm, ...ticketOptions }) {
  return (
    <UnstyledLink onClick={() => openSupportTicketForm(ticketOptions)}>
      {children}
    </UnstyledLink>
  );
}

export default connect(undefined, { openSupportTicketForm })(SupportTicketLink);
