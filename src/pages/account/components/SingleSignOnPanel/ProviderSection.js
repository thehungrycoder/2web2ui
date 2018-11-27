import React from 'react';
import { Panel } from '@sparkpost/matchbox';
import { LabelledValue, Modal } from 'src/components';
import ProviderForm from './ProviderForm';

export class ProviderSection extends React.Component {
  state = {
    isModalOpen: false
  }

  closeModal = () => {
    this.setState({ isModalOpen: false });
  }

  openModal = () => {
    this.setState({ isModalOpen: true });
  }

  render() {
    const { readOnly, provider } = this.props;

    return (
      <Panel.Section
        actions={[{
          color: 'orange',
          content: 'Provision SSO',
          disabled: readOnly,
          onClick: this.openModal
        }]}
      >
        <LabelledValue label="Identity Provider">
          <h6>
            {provider ? provider : 'Not provisioned'}
          </h6>
        </LabelledValue>
        <Modal open={this.state.isModalOpen}>
          <ProviderForm onCancel={this.closeModal} onSubmit={this.closeModal} />
        </Modal>
      </Panel.Section>
    );
  }
}

export default ProviderSection;
