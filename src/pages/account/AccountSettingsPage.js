import React, { Component } from 'react';
import { AccessControl } from 'src/components/auth';
import SsoManager from './components/SsoManager';

import { isAdmin } from 'src/helpers/conditions/user';

import { Page, Panel, UnstyledLink } from '@sparkpost/matchbox';

export default class AccountSettingsPage extends Component {
  render() {
    return <Page title='Account Settings'>
      <AccessControl condition={isAdmin}>
        <SsoManager />

        <Panel sectioned title="Request Account Cancellation">
          <p>
            To cancel your SparkPost account, {
              <UnstyledLink onClick={this.requestCancellation}>
                submit a cancellation request
              </UnstyledLink>
            }. The request may take a few days to process.  All your data (e.g. domains, users, etc.)
            will be permanently deleted. We're sorry to see you go!
          </p>
        </Panel>
      </AccessControl>
    </Page>;
  }
}
