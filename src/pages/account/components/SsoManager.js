import React, { Component } from 'react';
import { Panel, Grid, Button } from '@sparkpost/matchbox';
import Modal from 'src/components/modals/Modal';
import { LabelledValue } from 'src/components';
import FileFieldWrapper from 'src/components/reduxFormWrappers/FileFieldWrapper';
import styles from './SsoManager.module.scss';

class ProvisionSsoModal extends Component {
  componentDidUpdate(oldProps) {
    if (!oldProps.open && this.props.open) {
      this.setState({ provisioning: false });
    }

    if (this.state.provisioning && oldProps.open) {
      this.props.onClose();
    }

    if (this.state.provisioning && oldProps.open && !this.props.open) {
      this.props.onProvision();
    }
  }

  state = {
    provisioning: false
  }

  onProvision = () => this.setState({ provisioned: true })

  render() {
    const { provisioned, open, onClose } = this.props;
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
          <Button type='submit' primary onClick={this.onProvision}>Provision SSO</Button>
          <Button onClick={onClose} className={styles.Cancel}>Cancel</Button>
        </Panel.Section>
      </Panel>
    </Modal>;
  }
}

const SsoStatus = ({ provisioned, enabled }) => {
  const status = [];
  if (provisioned) {
    status.push('Provisioned');
  }
  if (enabled) {
    status.push('Enabled');
  } else {
    status.push('Disabled');
  }

  return <LabelledValue label='Status'>{status.join(', ')}</LabelledValue>;
};

export default class SsoManager extends Component {
  state = {
    modal: false,
    provisioned: false,
    enabled: false,
    hasSsoUsers: false
  }

  onProvision = () => this.setState({ modal: false }, () => this.setState({ provisioned: true }))

  onCloseModal = () => this.setState({ modal: false })

  onEnableChange = () => this.setState({ enabled: !this.state.enabled })

  render() {
    const { modal, provisioned } = this.state;

    const actions = [
      {
        content: provisioned ? 'Reprovision SSO' : 'Provision SSO',
        onClick: () => this.setState({ modal: true }),
        color: 'orange'
      },
      {
        content: 'Learn More',
        to: '#',
        external: true,
        color: 'orange'
      }
    ];

    return <Panel sectioned title='SAML Single Sign-On' actions={actions}>
      <SsoStatus {...this.state} />
      <ProvisionSsoModal open={modal} provisioned={provisioned} onProvision={this.onProvision} onClose={this.onCloseModal} />
    </Panel>;
  }
}
