import React from 'react';
import { Link } from 'react-router-dom';
import { Panel } from '@sparkpost/matchbox';
import { LabelledValue } from 'src/components';
import config from 'src/config';
const smtpAuth = config.smtpAuth;
const smtpDesc = 'Use the information below to configure your SMTP client to relay via SparkPost. You need an API key to use as a password when filling out the information.';

const SmtpDetails = () => (
  <Panel sectioned>
    <p>{smtpDesc}</p>
    <LabelledValue label='Host' value={smtpAuth.host}/>
    <LabelledValue label='Port' value={smtpAuth.port}/>
    { config.smtpAuth.alternativePort && <LabelledValue label='Alternative Port' value={`${smtpAuth.alternativePort}`}/> }
    <LabelledValue label='Authentication' value='AUTH LOGIN'/>
    <LabelledValue label='Encryption' value='STARTTLS'/>
    <LabelledValue label='Username' value={smtpAuth.username}/>
    <LabelledValue label='Password'>
      <span>The password is an API key with <strong>Send via SMTP</strong><em>(smtp/inject)</em> permisions.  <Link to='/account/api-keys'>Manage API Keys</Link></span>
    </LabelledValue>
  </Panel>
);

export default SmtpDetails;
