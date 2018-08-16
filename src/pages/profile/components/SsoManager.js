import React, { Component } from 'react';
import { Panel, Grid, Button, Toggle } from '@sparkpost/matchbox';
import { Check, ArrowForward } from '@sparkpost/matchbox-icons';
import FileFieldWrapper from 'src/components/reduxFormWrappers/FileFieldWrapper';
import { Link } from 'react-router-dom';

import styles from './SsoManager.module.scss';

const GreenCheck = () => <Check size={24} className={styles.GreenCheck}/>;

const ProvisioningForm = ({ onProvision }) => <Grid top='xs'>
  <Grid.Column>
    <FileFieldWrapper
      filetype='xml'
      input={{ id: 'xml' }}
      meta={{ touched: false, error: false }}
    />
  </Grid.Column>
  <Grid.Column>
    <Button onClick={onProvision} primary>Upload</Button>
  </Grid.Column>
</Grid>;

const StageTitle = ({ ready, done, cta }) => {
  const Tag = ({ children }) => ready ? <h6>{children}</h6> : <p>{children}</p>;
  return <Tag>{done ? <GreenCheck /> : null}{cta}</Tag>;
};

export default class SsoManager extends Component {
  state = {
    provisioned: false,
    enabled: false,
    hasSsoUsers: false
  }

  onProvision = () => this.setState({ provisioned: true })

  onEnableChange = () => this.setState({ enabled: !this.state.enabled })

  render() {
    const { provisioned, enabled, hasSsoUsers } = this.state;

    return <Panel sectioned title='SAML Single Sign-On'>
      <Panel.Section>
        <Grid>
          <Grid.Column xs={3}>
            <StageTitle ready={true} done={provisioned} cta='1. Provision SAML' />
          </Grid.Column>
          <Grid.Column>
            {provisioned
              ? <div>
                <h6>Provisioned to to your-saml-provider.example.com.</h6>
                <p>You can set up a new Identity Provider by uploading a new metadata file.</p>
              </div>
              : <p>Provision your SAML Identity Provider by uploading their IdP metadata XML file.</p>
            }
            <ProvisioningForm onProvision={this.onProvision} />
          </Grid.Column>
        </Grid>
      </Panel.Section>
      <Panel.Section>
        <Grid>
          <Grid.Column xs={3}>
            <StageTitle ready={provisioned} done={enabled} cta='2. Enable SSO' />
          </Grid.Column>
          <Grid.Column>
            <Toggle disabled={!provisioned} checked={enabled} onChange={this.onEnableChange} />
          </Grid.Column>
        </Grid>
      </Panel.Section>
      <Panel.Section>
        <Grid>
          <Grid.Column xs={3}>
            <StageTitle ready={enabled} done={enabled && hasSsoUsers} cta='3. Setup Users' />
          </Grid.Column>
          <Grid.Column>
            <Link to='/account/users'>Manage single sign-on users. <ArrowForward /></Link>
          </Grid.Column>
        </Grid>
      </Panel.Section>
    </Panel>;
  }
}
