import React, { Component } from 'react';
import { Panel } from '@sparkpost/matchbox';
import TutorialItem from './TutorialItem';

const sendingDomainUrl = 'account/sending-domains';

export class Tutorial extends Component {
  render() {
    const {
      currentUser,
      hasSendingDomains,
      hasVerifiedDomains,
      hasApiKeysForSending,
      hasBounceDomains,
      hasSentThisMonth
    } = this.props;

    return (
      <Panel title='Getting Started Checklist'>
        <Panel.Section>
          <TutorialItem
            label='Verify your email address'
            completed={currentUser.email_verified} >
            <p>Check your email to verify your email address and increase your daily sending limits</p>
          </TutorialItem>
        </Panel.Section>

        <Panel.Section>
          <TutorialItem
            label='Add a sending domain'
            labelLink={sendingDomainUrl}
            completed={hasSendingDomains}>
            <p>Add a sending domain to send email from your own domain</p>
          </TutorialItem>
        </Panel.Section>

        <Panel.Section>
          <TutorialItem
            label='Verify your sending domain'
            labelLink={sendingDomainUrl}
            completed={hasVerifiedDomains}>
            <p>You'll need to verify your domain before you can use it</p>
          </TutorialItem>
        </Panel.Section>

        <Panel.Section>
          <TutorialItem
            label='Create bounce domain'
            labelLink={sendingDomainUrl}
            completed={hasBounceDomains}>
            <p>Create a bounce domain to track email engagement</p>
          </TutorialItem>
        </Panel.Section>

        <Panel.Section>
          <TutorialItem
            label='Create an API key'
            labelLink='account/api-keys'
            completed={hasApiKeysForSending}>
            <p>You'll need to create an API key to use our API or SMTP integration.</p>
          </TutorialItem>
        </Panel.Section>

        <Panel.Section>
          <TutorialItem
            label='Send an email this month'
            completed={hasSentThisMonth}>
            <p>Get sending!</p>
          </TutorialItem>
        </Panel.Section>
      </Panel>
    );
  }
}

export default Tutorial;
