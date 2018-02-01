import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Page, Panel } from '@sparkpost/matchbox';
import { LabelledValue } from 'src/components';
import config from 'src/config';
const smtpAuth = config.smtpAuth;
const smtpDesc = 'Use the information below to configure your SMTP client to relay via SparkPost. You need an API key to use as a password when filling out the information.';

export class SmtpPage extends Component {
  renderSMTPDeets() {
    return (
      <Panel sectioned>
        <p>{smtpDesc}</p>
        <LabelledValue label='Host' value={smtpAuth.host}/>
        <LabelledValue label='Port' value={smtpAuth.port}/>
        { config.smtpAuth.alternativePort && <LabelledValue label='Alternative Port' value={`${smtpAuth.alternativePort}`}/> }
        <LabelledValue label='Authentication' value='AUTH LOGIN'/>
        <LabelledValue label='Encryption' value='STARTTLS'/>
        <LabelledValue label='Username' value={smtpAuth.username}/>
        <LabelledValue label='Password' value='.....TBD'/>
      </Panel>
    );

  }

  renderTracking() {
    return (
      <Panel sectioned title='Engagement Tracking'>
        <p>Engagement tracking allows the ability to show how many recipients opened messages or clicked links. This is the default setting for engagement tracking for SMTP.</p>
      </Panel>
    );
  }

  render() {
    return (
      <Page title='SMTP Relay'>
        { this.renderSMTPDeets() }
        { this.renderTracking() }
      </Page>
    );

  }
}


export default withRouter(connect(null, {})(SmtpPage));
