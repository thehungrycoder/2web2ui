import React, { Component } from 'react';
import { Panel, Grid, Button, Toggle } from '@sparkpost/matchbox';
import { Check } from '@sparkpost/matchbox-icons';
import FileFieldWrapper from 'src/components/reduxFormWrappers/FileFieldWrapper';
import { Link } from 'react-router-dom';

import styles from './SsoManager.module.scss';

const GreenCheck = () => <Check size={16} className={styles.GreenCheck}/>;

const ProvisioningForm = ({ onProvision }) => <Grid>
  <Grid.Column>
    <FileFieldWrapper
      filetype='xml'
      input={{ id: 'xml' }}
      meta={{ touched: false, error: false }}
    />
  </Grid.Column>
  <Grid.Column bottom='xs'>
    <Button onClick={onProvision} primary>Upload</Button>
  </Grid.Column>
</Grid>;

const StageTitle = ({ ready, done, cta }) => {
  const Tag = ({ children }) => ready ? <h6>{children}</h6> : <p>{children}</p>;
  return <Tag>{done ? <GreenCheck /> : null}{cta}</Tag>;
};

const ProvisioningStep = ({ provisioned }) => <StageTitle ready={true} done={provisioned} cta='Provisioning' />;
const EnableStep = ({ provisioned, enabled }) => <StageTitle ready={provisioned} done={enabled} cta='Enable SSO' />;
const SetupUsersStep = ({ enabled, hasSsoUsers }) => <StageTitle ready={enabled} done={enabled && hasSsoUsers} cta='Setup Users' />;

export default class SsoManager extends Component {
  state = {
    provisioned: false,
    enabled: false,
    hasSsoUsers: false
  }

  onProvision = () => this.setState({ provisioned: true })

  onEnableChange = () => this.setState({ enabled: !this.state.enabled })

  render() {
    const { provisioned, enabled } = this.state;

    return <Panel sectioned title='SAML Single Sign-On'>
      <Panel.Section>
        <Grid>
          <Grid.Column lg={3}>
            <ProvisioningStep {...this.state} />
          </Grid.Column>
          <Grid.Column>
            {provisioned
              ? <p>Provisioned to to your-saml-provider.example.com. You can set up a new Identity Provider by uploading a new metadata file.</p>
              : <p>Provision your SAML Identity Provider by uploading their IdP metadata XML file.</p>
            }
            <ProvisioningForm onProvision={this.onProvision} />
          </Grid.Column>
        </Grid>
      </Panel.Section>
      <Panel.Section>
        <Grid>
          <Grid.Column lg={3}>
            <EnableStep {...this.state} />
          </Grid.Column>
          <Grid.Column>
            <p><Toggle disabled={!provisioned} checked={enabled} onChange={this.onEnableChange} /></p>
          </Grid.Column>
        </Grid>
      </Panel.Section>
      <Panel.Section>
        <Grid>
          <Grid.Column lg={3}>
            <SetupUsersStep {...this.state} />
          </Grid.Column>
          <Grid.Column>
            <p><Link to='/account/users'>Manage single sign-on users.</Link></p>
          </Grid.Column>
        </Grid>
      </Panel.Section>
    </Panel>;
  }
}
