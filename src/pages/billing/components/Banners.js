import React from 'react';
import config from 'src/config';
import { format } from 'date-fns';
import { Banner } from '@sparkpost/matchbox';

const dateFormat = (date) => format(date, 'MMM DD, YYYY');

export const PendingPlanBanner = ({ account }) => account.pending_subscription
    ? <Banner status='info' title='Pending Plan Change' >
        <p>You're scheduled to switch to the { account.pending_subscription.name } plan on { dateFormat(account.pending_subscription.effective_date) }, and can't update your plan until that switch happens.</p>
        <p>If you have any questions, please <a href={`mailto:${config.contact.supportEmail}`}>contact support</a>.</p>
      </Banner>
    : null;

export const SuspendedBanner = ({ account }) => account.isSuspendedForBilling
    ? <Banner status='danger' title='Your account has been suspended due to a billing problem' >
        <p>We sent an email notification to your current billing contact email address ({ account.billing.email }). To reactivate your account and pay your outstanding balance due, please update your payment information below.</p>
        <p>If you have any questions, please <a href={`mailto:${config.contact.billingEmail}`}>contact us</a>.</p>
      </Banner>
    : null;

export const ManuallyBilledBanner = ({ account }) => {
  if (account.subscription.self_serve) {
    return null;
  }

  const content = account.pending_subscription
    ? <p>
        You're scheduled to switch to the { account.pending_subscription.name } plan on { dateFormat(account.pending_subscription.effective_date) }. If you have any questions, please <a href={`mailto:${config.contact.supportEmail}`}>contact support</a>.
      </p>
    : <p>To make changes to your plan or billing information, <a href={`mailto:${config.contact.supportEmail}`}>contact support</a>.</p>;

  return (
    <Banner status='info' title={`Your current ${account.subscription.name} plan includes ${account.subscription.plan_volume.toLocaleString()} emails /mo`} >
      { content }
    </Banner>
  );
};
