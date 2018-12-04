import React from 'react';
import { connect } from 'react-redux';
import { Page, Panel } from '@sparkpost/matchbox';
import LabelledValue from 'src/components/labelledValue/LabelledValue';
import CancellationPanel from './components/CancellationPanel';
import SingleSignOnPanel from './components/SingleSignOnPanel';
import EnforceTfaPanel from './components/EnforceTfaPanel';

export function AccountSettingsPage({ currentUser }) {
  return (
    <Page title="Account Settings">
      <Panel sectioned>
        <LabelledValue label="Account ID">
          {currentUser.customer}
        </LabelledValue>
      </Panel>
      <SingleSignOnPanel />
      <EnforceTfaPanel />
      <CancellationPanel />
    </Page>
  );
}

const mapStateToProps = ({ currentUser }) => ({ currentUser });

export default connect(mapStateToProps)(AccountSettingsPage);
