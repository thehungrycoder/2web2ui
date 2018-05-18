import React from 'react';
import config from 'src/config';
import { format } from 'date-fns';
import { Banner, UnstyledLink } from '@sparkpost/matchbox';
import { Link } from 'react-router-dom';
import { LINKS } from 'src/constants';
import * as conversions from 'src/helpers/conversionTracking';
import { ANALYTICS_PREMIUM_SUPPORT, ANALYTICS_ENTERPRISE_SUPPORT } from 'src/constants';

const dateFormat = (date) => format(date, 'MMM DD, YYYY');

/**
 * Renders pending plan change information
 * @prop account Account state from redux store
 */
export const PendingPlanBanner = ({ account }) => {
  if (!account.pending_subscription) {
    return null;
  }

  return (
    <Banner status='info' title='Pending Plan Change' >
      <p>
        You're scheduled to switch to the {account.pending_subscription.name} plan
        on {dateFormat(account.pending_subscription.effective_date)}, and can't update your plan
        until that switch happens.
      </p>
    </Banner>
  );
};

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
        You're scheduled to switch to the {account.pending_subscription.name} plan on {dateFormat(account.pending_subscription.effective_date)}. If you have any questions, please <UnstyledLink to={`mailto:${config.contact.supportEmail}`}>contact support</UnstyledLink>.
    </p>
    : <p>To make changes to your plan, billing information, or addons, <UnstyledLink to={`mailto:${config.contact.supportEmail}`}>contact support</UnstyledLink>.</p>;

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
      {content}
      {convertMarkup}
    </Banner>
  );
};

/**
 * Premium Addon Plan CTA
 */

const premiumAction = {
  content: 'Contact Us',
  to: LINKS.PREMIUM_SUPPORT,
  external: true
};

const awsPremiumAction = {
  content: 'Request Premium Support',
  component: Link,
  to: '/support/aws-premium'
};

export const PremiumBanner = ({ isAWSAccount }) => (
  <Banner title='Premium Addon Plan' action={{
    ...(isAWSAccount ? awsPremiumAction : premiumAction),
    onClick: () => conversions.trackAddonRequest(ANALYTICS_PREMIUM_SUPPORT)
  }}>
    <p>Get full-service Technical Account Management with proactive reporting, planning & reviews.</p>
    <ul>
      <li>Includes all standard SparkPost features</li>
      <li>Dedicated Technical Account Manager (TAM)</li>
      <li>Global ISP relations and mediation</li>
      <li>Deliverability data analysis and guidance with 250ok</li>
    </ul>
  </Banner>
);

/**
 * Enterprise CTA
 */
export const EnterpriseBanner = () => (
  <Banner title='Enterprise' action={{
    content: 'Contact Us',
    to: LINKS.ENTERPRISE_SUPPORT,
    external: true,
    onClick: () => conversions.trackAddonRequest(ANALYTICS_ENTERPRISE_SUPPORT)
  }}>
    <p>Enterprise-grade financial guarantees with 99.9% uptime SLA and guaranteed burst rates.</p>
    <ul>
      <li>Includes all standard SparkPost and Premium features</li>
      <li>Comprehensive uptime SLAs with service credits</li>
      <li>The industry’s only burst-rate guarantee</li>
      <li>Support for iOS Universal Links and Android App Links</li>
    </ul>
  </Banner>
);
