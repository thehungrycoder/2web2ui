import React from 'react';
import config from 'src/config';
import { format } from 'date-fns';
import { Banner } from '@sparkpost/matchbox';
import { Link } from 'react-router-dom';

const dateFormat = (date) => format(date, 'MMM DD, YYYY');

/**
 * Renders pending plan change information
 * @prop account Account state from redux store
 */
export const PendingPlanBanner = ({ account }) => account.pending_subscription
    ? <Banner status='info' title='Pending Plan Change' >
        <p>You're scheduled to switch to the { account.pending_subscription.name } plan on { dateFormat(account.pending_subscription.effective_date) }, and can't update your plan until that switch happens.</p>
        <p>If you have any questions, please <a href={`mailto:${config.contact.supportEmail}`}>contact support</a>.</p>
      </Banner>
    : null;

/**
 * Renders suspended-due-to-billing warning
 * @prop account Account state from redux store
 */
export const SuspendedBanner = ({ account }) => account.isSuspendedForBilling
    ? <Banner status='danger' title='Your account has been suspended due to a billing problem' >
        <p>We sent an email notification to your current billing contact email address ({ account.billing.email }). To reactivate your account and pay your outstanding balance due, please update your payment information below.</p>
        <p>If you have any questions, please <a href={`mailto:${config.contact.billingEmail}`}>contact us</a>.</p>
      </Banner>
    : null;

/**
 * Renders plan information for non-self-serve users
 * @prop account Account state from redux store
 */
export const ManuallyBilledBanner = ({ account, ...rest }) => {
  if (account.subscription.self_serve || !account.subscription.plan_volume) {
    return null;
  }

  const content = account.pending_subscription // Is this even possible??
    ? <p>
        You're scheduled to switch to the { account.pending_subscription.name } plan on { dateFormat(account.pending_subscription.effective_date) }. If you have any questions, please <a href={`mailto:${config.contact.supportEmail}`}>contact support</a>.
      </p>
    : <p>To make changes to your plan, billing information, or addons <a href={`mailto:${config.contact.supportEmail}`}>contact support</a>.</p>;

  const convertAction = !account.pending_subscription
    ? { content: 'Enable Automatic Billing', to: '/account/billing/plan', Component: Link }
    : null;

  const convertMarkup = !account.pending_subscription
    ? <p>Enable automatic billing to self-manage your plan and add-ons.</p>
    : null;

  return (
    <Banner
      status='info'
      title={`Your current ${account.subscription.name} plan includes ${account.subscription.plan_volume.toLocaleString()} emails per month`}
      action={convertAction}>
      { content }
      { convertMarkup }
    </Banner>
  );
};

/**
 * Premium Addon Plan CTA
 */
export const PremiumBanner = () => (
  <Banner title='Premium Addon Plan' action={{ content: 'Contact Us', to: 'https://www.sparkpost.com/contact-premium/', external: true }}>
    <p>Technical and deliverability account management - full service support on a first name basis.</p>
    <ul>
      <li>Dedicated Technical Account Manager</li>
      <li>Proactive deliverability reporting, planning & reviews</li>
      <li>Global ISP relations and mediation</li>
      <li>Deliverability data analysis and guidance with 250ok</li>
    </ul>
  </Banner>
);

/**
 * Enterprise CTA
 */
export const EnterpriseBanner = () => (
  <Banner title='Enterprise' action={{ content: 'Contact Us', to: 'https://www.sparkpost.com/contact-enterprise/', external: true }}>
    <p>Enterprise-grade guarantees and SLAs across email, push, and SMS - manage, analyzed, and reported from a single console.</p>
    <ul>
      <li>The industry's best uptime SLAs with service credits</li>
      <li>Guaranteed burst rates</li>
      <li>Push notifications and SMS messaging</li>
      <li>Single sign-on support</li>
      <li>Support for iOS universal links</li>
    </ul>
  </Banner>
);
