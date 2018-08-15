import React, { Component, Fragment } from 'react';
import { Panel, Grid, Button, Toggle } from '@sparkpost/matchbox';
import { Check } from '@sparkpost/matchbox-icons';
import FileFieldWrapper from 'src/components/reduxFormWrappers/FileFieldWrapper';
import { Link } from 'react-router-dom';
// import config from 'src/config';

import styles from './SsoManager.module.scss';

const GreenCheck = () => <Check size={16} className={styles.GreenCheck}/>;

const ProvisioningForm = ({ onProvision }) => <Grid>
  <Grid.Column>
    <FileFieldWrapper
      label='SAML IdP metadata XML file'
      filetype='xml'
      input={{ id: 'xml' }}
      meta={{ touched: false, error: false }}
    />
  </Grid.Column>
  <Grid.Column bottom='xs'>
    <Button onClick={onProvision} primary>Provision SAML</Button>
  </Grid.Column>
</Grid>;

const StageTitle = ({ ready, done, cta }) => <Fragment>
  {ready
    ? <p>{done ? <GreenCheck /> : null}{cta}</p>
    : <h6>{cta}</h6>
  }
</Fragment>;

const ProvisioningStep = () => <Fragment>
  <h6>1. Provision your SAML identity provider</h6>
</Fragment>;

const ReprovisioningStep = () => <StageTitle ready={true} done={true} cta='1. Provisioned to your-saml-provider.example.com</p>' />;
//{ false && <p>You can reprovision to another provider by uploading a new SAML metadata file.</p> }

const EnableStep = ({ provisioned, enabled }) => <StageTitle ready={provisioned} done={enabled} cta='2. Enable single sign-on for your account' />;

const SetupUsersStep = ({ enabled, hasSsoUsers }) => <StageTitle ready={enabled} done={hasSsoUsers} cta='3. Setup SSO users' />;

export default class SsoManager extends Component {
  state = {
    provisioned: false,
    enabled: false,
    hasSsoUsers: true
  }

  onProvision = () => this.setState({ provisioned: true })

  onEnableChange = () => this.setState({ enabled: !this.state.enabled })

  render() {
    const { provisioned, enabled } = this.state;

    return <Panel sectioned title='SAML Single Sign-On'>
      {}

      <Grid>
        <Grid.Column lg={4}>
          {provisioned
            ? <ReprovisioningStep {...this.state} />
            : <ProvisioningStep {...this.state} />
          }
        </Grid.Column>
        <Grid.Column>
          <ProvisioningForm onProvision={this.onProvision} />
        </Grid.Column>
      </Grid>
      <Grid>
        <Grid.Column lg={4}>
          <EnableStep {...this.state} />
        </Grid.Column>
        <Grid.Column>
          <Toggle disabled={!provisioned} checked={enabled} onChange={this.onEnableChange} />
        </Grid.Column>
      </Grid>
      <Grid>
        <Grid.Column lg={4}>
          <SetupUsersStep {...this.state} />
        </Grid.Column>
        <Grid.Column>
          <p><Link to='/account/users'>Manage single sign-on users.</Link></p>
        </Grid.Column>
      </Grid>
    </Panel>;
  }
}
