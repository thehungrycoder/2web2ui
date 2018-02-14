import React, { Component, Fragment } from 'react';
import AutoKeyGenerator from './components/AutoKeyGenerator';
import { CenteredLogo, CopyField } from 'src/components';
import { Panel, TextField } from '@sparkpost/matchbox';
import Steps from './components/Steps';
import SkipLink from './components/SkipLink';
import config from 'src/config';

class ApiPage extends Component {
  getTransmissionsUri() {
    const configUri = `${config.apiBase}/api/v1/transmissions`;

    // if config uri is protocol-relative, prepend window protocol
    if (/^\/\//.test(configUri)) {
      return window.location.protocol + configUri;
    }

    return configUri;
  }

  request({ apiKey, email }) {
    return `curl -X POST \
      ${this.getTransmissionsUri()} \
      -H "Authorization: ${apiKey}" \
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
        "recipients": [{ "address": "${email}" }]
    }'`;
  }

  render() {
    return (
      <AutoKeyGenerator>
        {({ apiKey, email }) => (
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
                <code>
                  <TextField multiline readOnly rows={15} value={this.request({ apiKey, email })}></TextField>
                </code>
              </Panel.Section>
              <Panel.Section>
                <SkipLink to='/dashboard'>Continue to dashboard</SkipLink>
              </Panel.Section>
              <Steps />
            </Panel>
          </Fragment>
        )}
      </AutoKeyGenerator>
    );
  }
}

export default ApiPage;
