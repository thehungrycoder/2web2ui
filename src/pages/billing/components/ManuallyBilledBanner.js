import React from 'react';
import { Banner } from '@sparkpost/matchbox';
import PageLink from 'src/components/pageLink/PageLink';
import SupportTicketLink from 'src/components/supportTicketLink/SupportTicketLink';

/**
 * Renders plan information for non-self-serve users
 * @prop account Account state from redux store
 */
const ManuallyBilledBanner = ({
  account: {
    subscription: {
      custom,
      name: subscriptionName,
      period = 'month',
      plan_volume: planVolume,
      plan_volume_per_period: planVolumePerPeriod,
      recurring_charge: recurringCharge
    }
  },
  onZuoraPlan
}) => {
  const localePlanVolume = (planVolumePerPeriod || planVolume).toLocaleString();
  const title = `
    Your current ${subscriptionName} plan includes ${localePlanVolume} emails per ${period}
  `;

  // this is an edge case that will only happen if the custom plan is not configured correctly
  // with charge and volume
  if (custom && (!planVolumePerPeriod || !recurringCharge)) {
    return (
      <Banner
        status="warning"
        title={`Your current plan is being transitioned to a ${subscriptionName} plan`}
      >
        <p>
          If your account should not be transitioned, please {
            <SupportTicketLink issueId="general_issue">submit a support ticket</SupportTicketLink>
          }.
        </p>
      </Banner>
    );
  }

  const autoBillingAvailable = !custom && onZuoraPlan;
  const action = autoBillingAvailable
    ? {
      Component: PageLink,
      content: 'Enable Automatic Billing',
      to: custom ? '/account/billing/enable-automatic' : '/account/billing/plan'
    }
    : null;

  return (
    <Banner
      status="info"
      title={title}
      action={action}
    >
      <p>
        To make changes to your plan or billing information, please {
          <SupportTicketLink issueId="general_issue">submit a support ticket</SupportTicketLink>
        }.
      </p>
      {autoBillingAvailable && (
        <p>
          Enable automatic billing to self-manage your plan and add-ons.
        </p>
      )}
    </Banner>
  );
};

export default ManuallyBilledBanner;
