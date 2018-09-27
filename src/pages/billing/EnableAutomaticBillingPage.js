import React from 'react';
import { Page } from '@sparkpost/matchbox';
import PageLink from 'src/components/pageLink/PageLink';
import EnableAutomaticBillingForm from './forms/EnableAutomaticBillingForm';

const EnableAutomaticBillingPage = () => (
  <Page
    breadcrumbAction={{
      Component: PageLink,
      content: 'Back to billing',
      to: '/account/billing'
    }}
  >
    <EnableAutomaticBillingForm />
  </Page>
);

export default EnableAutomaticBillingPage;
