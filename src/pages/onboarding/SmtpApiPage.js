import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Panel, UnstyledLink, Grid, Icon } from '@sparkpost/matchbox';
import { CenteredLogo } from 'src/components';
import OptionTile from './components/OptionTile';

import styles from './Onboarding.module.scss';

const SmtpApiPage = () => (
  <Fragment>
    <CenteredLogo />
    <Panel accent title='Sending Your First Email'>
      <Panel.Section>
        <p>How will you send email with us?</p>

        <Grid>
          <Grid.Column xs={12} md={6}>
            <OptionTile
              to='/super-hidden-route/smtp'
              wrapper={Link}
              label='SMTP'
              content='Set up your own mail server to send through our SMTP relay service.'
            />
          </Grid.Column>
          <Grid.Column xs={12} md={6}>
            <OptionTile
              to='/super-hidden-route/api'
              wrapper={Link}
              label='REST API'
              content='Use our powerful REST API to send email via simple HTTP requests'
            />
          </Grid.Column>
        </Grid>
      </Panel.Section>
      <Panel.Section>
        <UnstyledLink
          to='/dashboard'
          Component={Link}
          className={styles.SkipLink}>
                Or continue to dashboard <Icon name='ArrowRight'/>
        </UnstyledLink>
      </Panel.Section>
    </Panel>
  </Fragment>
);

export default SmtpApiPage;
