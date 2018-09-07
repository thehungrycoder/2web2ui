import React from 'react';
import { Page } from '@sparkpost/matchbox';
import CancellationPanel from './components/CancellationPanel';

export default function AccountSettingsPage() {
  return (
    <Page title="Account Settings">
      <CancellationPanel />
    </Page>
  );
}
