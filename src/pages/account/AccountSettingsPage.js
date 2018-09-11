import React from 'react';
import { Page } from '@sparkpost/matchbox';
import CancellationPanel from './components/CancellationPanel';
import SingleSignOnPanel from './components/SingleSignOnPanel';

export default function AccountSettingsPage() {
  return (
    <Page title="Account Settings">
      <SingleSignOnPanel />
      <CancellationPanel />
    </Page>
  );
}
