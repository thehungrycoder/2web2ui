import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Panel, UnstyledLink, Grid, Icon } from '@sparkpost/matchbox';
import { CenteredLogo } from 'src/components';
import OptionTile from './components/OptionTile';
import Steps from './components/Steps';

import styles from './Onboarding.module.scss';

class SmtpOrApiPage extends Component {
  render() {
    return (
      <Fragment>
        <CenteredLogo />
        <Panel accent title='Sending Your First Email' ref={(ref) => this.panelRef = ref}>
          <Panel.Section>
            <p>How will you send email with us?</p>

            <Grid>
              <Grid.Column xs={12} md={6}>
                <OptionTile
                  to='/super-hidden-route/email/smtp'
                  wrapper={Link}
                  label='SMTP'
                  content='Set up your own mail server to send through our SMTP relay service.'
                />
              </Grid.Column>
              <Grid.Column xs={12} md={6}>
                <OptionTile
                  to='/super-hidden-route/email/api'
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
          <Steps />
        </Panel>
      </Fragment>
    );
  }
}

export default SmtpOrApiPage;
