import React, { Fragment } from 'react';
import { Banner } from '@sparkpost/matchbox';
import UpdatePaymentForm from '../forms/UpdatePayment';
import SupportTicketLink from 'src/components/supportTicketLink/SupportTicketLink';

export default function SuspendedForBilling({ account }) {
  const { billing = {}} = account;
  const email = billing.email ? ` (${billing.email})` : '';
  return (
    <Fragment>
      <Banner status='danger' title='Your account has been suspended due to a billing problem' >
        <p>
          We sent an email notification to your current billing contact email address {email}. To
          reactivate your account and pay your outstanding balance due, please update your payment
          information below.
        </p>
        <p>
          If this is incorrect, please {
            <SupportTicketLink issueId="account_suspension">
              submit a support ticket
            </SupportTicketLink>
          } and let us know why.
        </p>
      </Banner>
      <UpdatePaymentForm />
    </Fragment>
  );
}
