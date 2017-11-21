import React, { Component } from 'react';

import { Panel } from '@sparkpost/matchbox';
import TutorialItem from './TutorialItem';

export class Tutorial extends Component {
  render() {
    const {
      currentUser
    } = this.props;

    return (
        <Panel title='Getting Started'>
          <Panel.Section>
            <TutorialItem
              label='Verify your email address'
              completed={currentUser['email_verfied']} >
              <p>Check your email to verify your email address and increase your daily sending limits</p>
            </TutorialItem>
          </Panel.Section>

          <Panel.Section>
            <TutorialItem
              completed
              label='Add a sending domain'
              labelLink='settings/profile'>
              <p>Add a sending domain to send email from your own domain</p>
            </TutorialItem>
          </Panel.Section>

          <Panel.Section>
            <TutorialItem
              completed
              label='Verify your sending domain'
              labelLink='settings/profile'>
              <p>You'll need to verify your domain before you can use it</p>
            </TutorialItem>
          </Panel.Section>

          <Panel.Section>
            <TutorialItem
              label='Create bounce domain'
              labelLink='settings/profile'>
              <p>Create a bounce domain to track email engagement</p>
            </TutorialItem>
          </Panel.Section>

          <Panel.Section>
            <TutorialItem
              label='Create an API key'
              labelLink='settings/profile'>
              <p>You'll need to create an API key to use our API or SMTP integration.</p>
            </TutorialItem>
          </Panel.Section>
        </Panel>
    );
  }
}

export default Tutorial;
