import React, { Component } from 'react';
import Modal from 'src/components/modals/Modal';
import { Panel, TextField, Banner } from '@sparkpost/matchbox';

export default class BackupCodesModal extends Component {
  state = {
    password: null
  };

  handleInputChange = ({ target }) => {
    this.setState({ code: target.value });
  }

  render() {
    const {
      open,
      onClose,
      generate,
      codes
    } = this.props;

    return (
      <Modal open={open}>
        <Panel title='Generate 2FA Backup Codes' accent actions={[{ content: 'Cancel', onClick: onClose }, { content: 'Generate', onClick: generate }]}>
          <Panel.Section>
            <p>Keep these single-use 8 digit backup codes somewhere safe but accessible.
              They can be used if your authentication app is unavailable (<span role="img" aria-label="phone in toilet emojis">📱  ➡︎🚽</span> , etc).
            </p>
            <Banner title="Overwrite codes" status="warning" >
              Clicking Generate will overwrite the {codes.length} backup codes
            </Banner>
            <TextField type="password" placeholder='Password' onChange={this.handleInputChange} value={this.state.password} />
          </Panel.Section>
        </Panel>
      </Modal>
    );

  }
}
