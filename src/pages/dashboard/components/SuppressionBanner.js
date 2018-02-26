import React from 'react';
import { LINKS } from 'src/constants';
import { Banner, UnstyledLink } from '@sparkpost/matchbox';

const SuppressionBanner = ({ accountAgeInWeeks, hasSuppressions }) => {
  if (accountAgeInWeeks > 1 && hasSuppressions === false) {
    return (
      <Banner title="Coming from another email service?">
        <p>Welcome! Make sure you import your suppression list from your previous provider to avoid sending to people who have previously opted out, consistently bounced, etc. Learn more about migrating from Mailgun, Mandrill, or SendGrid. <UnstyledLink to={LINKS.SUPPRESSION_MIGRATION} external>Import your suppressions</UnstyledLink>.</p>
      </Banner>
    );
  }

  return null;
};

export default SuppressionBanner;
