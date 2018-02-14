import React, { Fragment } from 'react';
import AutoKeyGenerator from './components/AutoKeyGenerator';
import { CenteredLogo } from 'src/components';
import SmtpDetails from 'src/components/smtpDetails/SmtpDetails';
import { Panel } from '@sparkpost/matchbox';
import Steps from './components/Steps';
import SkipLink from './components/SkipLink';

export const SmtpPage = ({ apiKey }) => (
  <Fragment>
    <CenteredLogo />
    <Panel accent title='SMTP Integration'>
      <Panel.Section>
        <SmtpDetails apiKey={apiKey} />
      </Panel.Section>
      <Panel.Section>
        <SkipLink to='/dashboard'>Continue to dashboard</SkipLink>
      </Panel.Section>
      <Steps />
    </Panel>
  </Fragment>
);

export default <AutoKeyGenerator render={SmtpPage} />;
