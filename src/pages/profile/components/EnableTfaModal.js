import React, { Component } from 'react';
import { QRCode } from 'react-qr-svg';
import Modal from 'src/components/modals/Modal';
import styles from './TfaModals.module.scss';
import { Panel, Button, TextField, Grid, Icon } from '@sparkpost/matchbox';
import PanelLoading from 'src/components/panelLoading/PanelLoading';

export default class EnableTfaModal extends Component {

  state = {
    code: '',
    showErrors: false
  };

  componentDidUpdate(oldProps) {
    if (this.props.enabled && this.props.open) {
      this.props.onClose();
    }
    if (!oldProps.open && this.props.open) {
      this.props.getSecret();
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

  renderContent() {
    const { onClose, secret, username, togglePending, toggleError } = this.props;
    // TODO: move to selector?
    const qrData = `otpauth://totp/${username}?secret=${encodeURIComponent(secret)}&issuer=SparkPost`;

    return (
      <form onSubmit={(e) => e.preventDefault()}>
        <Panel.Section>
          <Grid>
            <Grid.Column xs={12} md={7}>
              <h6>Step 1: Configure your 2FA app</h6>
              <p>To enable 2FA, you'll need to have a 2FA auth app installed on your phone or tablet (examples include Google Authenticator, Duo Mobile, and Authy).</p>
              <p>Most apps will let you get set up by scanning our QR code from within the app. If you prefer, you can type in the key manually.</p>
              <p><strong><Icon name="Key"/> <code>{secret}</code></strong></p>
            </Grid.Column>
            <Grid.Column xs={12} md={5} style={{ textAlign: 'center' }}>
              <QRCode
                bgColor="#FFFFFF"
                fgColor="#000000"
                level="Q"
                style={{ width: 230 }}
                value={qrData}
              />
            </Grid.Column>
          </Grid>
        </Panel.Section>
        <Panel.Section>
          <Grid>
            <Grid.Column xs={12} md={7}>
              <h6>Step 2: Enter a 2FA code</h6>
              <p>Generate a code from your newly-activated 2FA app to confirm that you're all set up.</p>
              <TextField required={true} data-lpignore={true} label='Passcode' error={(this.state.showErrors && toggleError) ? 'Problem verifying your code, please try again' : ''} placeholder='Enter a generated 2FA passcode' onChange={this.handleInputChange} value={this.state.code} />
            </Grid.Column>
          </Grid>
        </Panel.Section>
        <Panel.Section>
          <Button type='submit' primary onClick={this.enable}>
            {togglePending ? 'Verifying Code...' : 'Enable 2FA'}
          </Button>
          <Button onClick={onClose} className={styles.Cancel}>Cancel</Button>
        </Panel.Section>
      </form>
    );
  }

  render() {
    const { open, secret } = this.props;

    return (
      <Modal open={open}>
        <Panel title='Enable Two-Factor Authentication' accent>
          {secret ? this.renderContent() : <PanelLoading />}
        </Panel>
      </Modal>
    );
  }

}
