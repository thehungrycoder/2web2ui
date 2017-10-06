import React from 'react';
import { EmptyState } from '@sparkpost/matchbox';

const TrackingDomainsEmptyState = () => (
  <EmptyState
    title="Round out your branding with Tracking Domains"
    action={{ content: 'Create a Tracking Domain' }}
    secondaryAction={{ content: 'API Docs', to: 'https://developers.sparkpost.com/api/tracking-domains.html', target: '_blank' }}
  >
    <p>Tracking Domains Explanation</p>
  </EmptyState>
);

export default TrackingDomainsEmptyState;
