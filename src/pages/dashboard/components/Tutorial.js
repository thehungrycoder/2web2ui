import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Panel } from '@sparkpost/matchbox';
import { OpenInNew } from '@sparkpost/matchbox-icons';
import TutorialItem from './TutorialItem';
import { LINKS } from 'src/constants';

export class Tutorial extends Component {
  render() {
    const {
      currentUser,
      hasSendingDomains,
      hasVerifiedDomains,
      hasApiKeysForSending,
      hasSentThisMonth
    } = this.props;

    return (
      <Panel title='Getting Started Checklist' actions={[{
        content: <span>Need help? Check out our Getting Started guide <OpenInNew size={13}/></span>,
        color: 'orange',
        external: true,
        to: LINKS.GETTING_STARTED_GUIDE }]}>

        <TutorialItem
          label='Verify your email address'
          completed={currentUser.email_verified}>
          <p>So we know you're legitimate, check your email to verify your email address. This also unlocks higher daily sending limits.</p>
        </TutorialItem>

        <TutorialItem
          label='Add a sending domain'
          actions={[{ content: 'Add Sending Domain', color: 'orange', component: Link, to: '/account/sending-domains/create' }]}
          completed={hasSendingDomains}>
          <p>Adding a sending domain will allow you to send email from your own domain.</p>
        </TutorialItem>

        <TutorialItem
          label='Verify your sending domain'
          actions={[{ content: 'View Sending Domains', color: 'orange', component: Link, to: '/account/sending-domains' }]}
          completed={hasVerifiedDomains}>
          <p>You'll need to verify your domain before you can use it.</p>
        </TutorialItem>

        <TutorialItem
          label='Get an API key for sending email'
          labelLink='account/api-keys'
          actions={[{ content: 'Create an API Key', color: 'orange', component: Link, to: '/account/api-keys/create' }]}
          completed={hasApiKeysForSending}>
          <p>You'll need to create an API key with the correct permissions to send email.</p>
        </TutorialItem>

        <TutorialItem
          label='Send an email'
          completed={hasSentThisMonth}>
          <p>Get sending!</p>
        </TutorialItem>
      </Panel>
    );
  }
}

export default Tutorial;
