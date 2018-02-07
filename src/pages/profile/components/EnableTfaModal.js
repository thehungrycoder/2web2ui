import React, { Component } from 'react';
import { QRCode } from 'react-qr-svg';
import Modal from 'src/components/modals/Modal';
import { Panel, Button, TextField, Grid } from '@sparkpost/matchbox';

export default class EnableTfaModal extends Component {

  state = {
    code: '',
    showErrors: false
  };

  componentDidUpdate(oldProps) {
    if (this.props.enabled && this.props.open) {
      this.props.onClose();
    }
    if (oldProps.open && !this.props.open) {
      this.setState({
        code: '',
        showErrors: false
      });
    }
    if (!oldProps.toggleError && this.props.toggleError) {
      this.setState({
        showErrors: true
      });
    }
  }

  handleInputChange = ({ target }) => {
    this.setState({ code: target.value });
  }

  enable = () => {
    this.props.enable(this.state.code);
  }

  render() {
    const { open, onClose, secret, username, togglePending, toggleError } = this.props;

    if (!secret) {
      return null;
    }

    const qrData = `otpauth://totp/${username}?secret=${encodeURIComponent(secret)}&issuer=SparkPost`;

    return (
      <Modal open={open}>
        <Panel title='Enable Two-Factor Authentication' accent actions={[{ content: 'Close', onClick: onClose }]}>
          <Panel.Section>
            To enable 2FA, you'll need to have a 2FA auth app installed on your phone or tablet (examples include Google Authenticator, Duo Mobile, and Authy).
          </Panel.Section>
          <Panel.Section>
            <Grid>
              <Grid.Column xs={12} md={6}>
                <p><strong>Step 1: Configure your 2FA app</strong></p>
                <p>Most apps will let you get set up by scanning our QR code from within the app. If you prefer, you can type in the key manually.</p>
                <p><code>KEY: {secret}</code></p>
              </Grid.Column>
              <Grid.Column xs={12} md={6} style={{ textAlign: 'center' }}>
                <QRCode
                  bgColor="#FFFFFF"
                  fgColor="#000000"
                  level="Q"
                  style={{ width: 256 }}
                  value={qrData}
                />
              </Grid.Column>
            </Grid>
          </Panel.Section>
          <Panel.Section>
            <Grid>
              <Grid.Column xs={12} md={6}>
                <p><strong>Step 2: Enter a 2FA code</strong></p>
                <p>Generate a code from your newly-activated 2FA app to confirm that you're all set up.</p>
                <TextField error={(this.state.showErrors && toggleError) ? 'Problem verifying your code, please try again' : ''} placeholder='Enter your code' onChange={this.handleInputChange} value={this.state.code} />
              </Grid.Column>
            </Grid>
          </Panel.Section>
          <Panel.Section>
            <Button primary onClick={this.enable}>
              {togglePending ? 'Verifying Code...' : 'Enable 2FA'}
            </Button>
          </Panel.Section>
        </Panel>
      </Modal>
    );
  }

}
