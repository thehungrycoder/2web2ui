import React from 'react';
import { Link } from 'react-router-dom';
import { Page } from '@sparkpost/matchbox';

const primaryAction = {
  content: 'Create Tracking Domain',
  Component: Link,
  to: '/account/tracking-domains/create'
};

const TrackingDomainsListHeader = () => (
  <Page title='Tracking Domains' primaryAction={primaryAction}/>
);

export default TrackingDomainsListHeader;
