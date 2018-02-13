import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { CenteredLogo } from 'src/components';
import SmtpDetails from 'src/components/smtpDetails/SmtpDetails';
import { Panel, UnstyledLink, Icon } from '@sparkpost/matchbox';

import styles from './Onboarding.module.scss';

class SmtpPage extends Component {
  render() {
    return (
      <Fragment>
        <CenteredLogo />
        <Panel accent title='SMTP Integration'>
          <Panel.Section>
            <SmtpDetails autoGenerateKey />
          </Panel.Section>
          <Panel.Section>
            <UnstyledLink
              to='/dashboard'
              Component={Link}
              className={styles.SkipLink}>
                Continue to dashboard <Icon name='ArrowRight'/>
            </UnstyledLink>
          </Panel.Section>
        </Panel>
      </Fragment>
    );
  }
}

export default SmtpPage;
