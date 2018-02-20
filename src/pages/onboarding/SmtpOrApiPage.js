import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Panel, Grid } from '@sparkpost/matchbox';
import { CenteredLogo } from 'src/components';
import OptionTile from './components/OptionTile';
import Steps from './components/Steps';
import SkipLink from './components/SkipLink';

const SmtpOrApiPage = () => (
  <Fragment>
    <CenteredLogo />
    <Panel accent title='Sending Your First Email'>
      <Panel.Section>
        <p>How will you send email with us?</p>
        <Grid>
          <Grid.Column xs={12} md={6}>
            <OptionTile
              to='/onboarding/email/smtp'
              wrapper={Link}
              label='SMTP'
              content='Set up your own mail server to send through our SMTP relay service.'
            />
          </Grid.Column>
          <Grid.Column xs={12} md={6}>
            <OptionTile
              to='/onboarding/email/api'
              wrapper={Link}
              label='REST API'
              content='Use our powerful REST API to send email via simple HTTP requests'
            />
          </Grid.Column>
        </Grid>
      </Panel.Section>
      <Panel.Section>
        <SkipLink to='/dashboard'>Continue to dashboard</SkipLink>
      </Panel.Section>
      <Steps />
    </Panel>
  </Fragment>
);


export default SmtpOrApiPage;
