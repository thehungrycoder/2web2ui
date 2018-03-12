
import React, { Fragment } from 'react';
import config from 'src/config';
import { Banner, UnstyledLink } from '@sparkpost/matchbox';
import UpdatePaymentForm from '../forms/UpdatePayment';

export default function SuspendedForBilling({ account }) {
  const { billing } = account;
  return (
    <Fragment>
      <Banner status='danger' title='Your account has been suspended due to a billing problem' >
        <p>We sent an email notification to your current billing contact email address ({billing.email}). To reactivate your account and pay your outstanding balance due, please update your payment information below.</p>
        <p>If you have any questions, please <UnstyledLink to={`mailto:${config.contact.billingEmail}`}>contact us</UnstyledLink>.</p>
      </Banner>
      <UpdatePaymentForm />
    </Fragment>
  );
}
