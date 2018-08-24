import React, { Component } from 'react';
import { Panel, Grid, Button, UnstyledLink } from '@sparkpost/matchbox';
import { ArrowForward } from '@sparkpost/matchbox-icons';
import Modal from 'src/components/modals/Modal';
import { LabelledValue } from 'src/components';
import FileFieldWrapper from 'src/components/reduxFormWrappers/FileFieldWrapper';
import styles from './SsoManager.module.scss';

class ProvisionSsoModal extends Component {
  render() {
    const { provisioned, open, onProvision, onClose } = this.props;
    return <Modal open={open}>
      <Panel title='Provision SAML Single Sign-on' accent>
        <Panel.Section>
          <Grid center='xs'>
            <Grid.Column xs={8}>
              {provisioned
                ? <div>
                  <h6>Provisioned to to your-saml-provider.example.com.</h6>
                  <p>You can set up a new Identity Provider by uploading a new metadata file.</p>
                </div>
                : <p>Provision your SAML Identity Provider by uploading their IdP metadata XML file.</p>
              }
              <FileFieldWrapper
                filetype='xml'
                input={{ id: 'xml' }}
                meta={{ touched: false, error: false }}
              />
            </Grid.Column>
          </Grid>
        </Panel.Section>
        <Panel.Section>
          <Button type='submit' primary onClick={onProvision}>Provision SSO</Button>
          <Button onClick={onClose} className={styles.Cancel}>Cancel</Button>
        </Panel.Section>
      </Panel>
    </Modal>;
  }
}

const Provision = ({ provisioned, onProvision }) => {
  const actionMsg = provisioned ? 'Reprovision SAML' : 'Provision SAML';
  return <Panel.Section actions={[ { content: actionMsg, onClick: onProvision, color: 'orange' } ]}>
    <LabelledValue label='SAML'>
      <h6>{provisioned ? 'Provisioned to your-saml-provider.example.com' : 'Not provisioned'}</h6>
      {!provisioned && <p>Provision your SAML identity providor to turn on SSO.</p>}
    </LabelledValue>
  </Panel.Section>;
};

const Enable = ({ enabled, onToggle }) => {
  const actionMsg = enabled ? 'Disable SSO' : 'Enable SSO';

  const status = enabled ? 'Enabled' : 'Disabled';

  return <Panel.Section actions={[ { content: actionMsg, onClick: onToggle, color: 'orange' } ]}>
    <LabelledValue label='Single Sign-On'>
      <h6>{status}</h6>
      {enabled && <h6><UnstyledLink to='/account/users'>Manage single sign-on users <ArrowForward/></UnstyledLink></h6>}
    </LabelledValue>
  </Panel.Section>;
};

export default class SsoManager extends Component {
  state = {
    modal: false,
    provisioned: false,
    enabled: false,
    hasSsoUsers: false
  }

  onProvision = () => this.setState({ modal: false }, () => this.setState({ provisioned: true }))

  openModal = () => this.setState({ modal: true })
  closeModal = () => this.setState({ modal: false })

  onEnableToggle = () => this.setState({ enabled: !this.state.enabled })

  render() {
    const { modal, provisioned, enabled } = this.state;

    return <Panel title='Single Sign-On' actions={[{ content: 'Learn More', color: 'orange' }]}>
      <Provision provisioned={provisioned} onProvision={this.openModal} />
      {provisioned && <Enable enabled={enabled} onToggle={this.onEnableToggle} />}
      <ProvisionSsoModal open={modal} provisioned={provisioned} onProvision={this.onProvision} onClose={this.closeModal} />
    </Panel>;
  }
}
