import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { CenteredLogo, CopyField } from 'src/components';
import { Panel, UnstyledLink, Icon, TextField } from '@sparkpost/matchbox';
import Steps from './components/Steps';

import styles from './Onboarding.module.scss';

class ApiPage extends Component {
  render() {
    return (
      <Fragment>
        <CenteredLogo />
        <Panel accent title='REST API Integration'>
          <Panel.Section>
            <CopyField label='Your API Key' value='password' helpText={'For security, we\'ll never display this full key again. Make sure you copy it somewhere safe!'}/>
          </Panel.Section>
          <Panel.Section>
            <h6>Send a Test Message</h6>
            <p>Copy and run this curl request:</p>
            <code>
              <TextField multiline readOnly rows={15} value={`curl -X POST \
  https://api.sparkpost.com/api/v1/transmissions \
  -H "Authorization: ef11b518082947b6edcefa1fca0e3e157a9234cf" \
  -H "Content-Type: application/json" \
  -d '{
    "options": {
      "sandbox": true
    },
    "content": {
      "from": "sandbox@sparkpostbox.com",
      "subject": "Thundercats are GO!!!",
      "text": "Sword of Omens, give me sight BEYOND sight"
    },
    "recipients": [{ "address": "appteam@messagesystems.com" }]
}'`}></TextField></code>
          </Panel.Section>
          <Panel.Section>
            <UnstyledLink
              to='/dashboard'
              Component={Link}
              className={styles.SkipLink}>
                Continue to dashboard <Icon name='ArrowRight'/>
            </UnstyledLink>
          </Panel.Section>
          <Steps />
        </Panel>
      </Fragment>
    );
  }
}

export default ApiPage;
