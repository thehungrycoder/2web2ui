import React, { Fragment } from 'react';
import { curlRequest } from 'src/helpers/onboarding';
import AutoKeyGenerator from './components/AutoKeyGenerator';
import { CenteredLogo, CopyField } from 'src/components';
import { Panel, CodeBlock } from '@sparkpost/matchbox';
import Steps from './components/Steps';
import SkipLink from './components/SkipLink';

const ApiPage = () => (
  <AutoKeyGenerator render={
    ({ apiKey, email }) => (
      <Fragment>
        <CenteredLogo />
        <Panel accent title='REST API Integration'>
          <Panel.Section>
            <CopyField
              value={apiKey}
              label='Your API Key'
              helpText={'For security, we\'ll never display this full key again. Make sure you copy it somewhere safe!'}/>
          </Panel.Section>
          <Panel.Section>
            <h6>Send a Test Message</h6>
            <p>Copy and run this curl request:</p>
            <CodeBlock height={350} code={curlRequest({ apiKey, email })} />
          </Panel.Section>
          <Panel.Section>
            <SkipLink to='/dashboard'>Continue to dashboard</SkipLink>
          </Panel.Section>
          <Steps />
        </Panel>
      </Fragment>
    )
  }/>
);

export default ApiPage;
