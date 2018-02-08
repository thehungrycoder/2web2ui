import React, { Component } from 'react';
import Modal from 'src/components/modals/Modal';
import { Icon, Panel, TextField, Banner, Button, Grid, Tooltip } from '@sparkpost/matchbox';
import styles from './TfaModals.module.scss';
import copy from 'copy-to-clipboard';
const initialState = {
  password: '',
  showErrors: false
};

export default class BackupCodesModal extends Component {
  state = initialState;
  timeout = null;

  componentDidUpdate(oldProps) {
    if (oldProps.open && !this.props.open) {
      this.setState(initialState);
    }

    if (!oldProps.error && this.props.error) {
      this.setState({ showErrors: true });
    }
  }

  handleInputChange = ({ target }) => {
    this.setState({ password: target.value });
  }

  generateCodes = () => {
    this.props.generate(this.state.password);
  }

  copyToClipboard = () => {
    copy(this.props.codes.join('\n'));
    this.setState({ copied: true });
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => this.setState({ copied: false }), 3000);
  }

  downloadCodes = () => {
    const codesb64 = btoa(this.props.codes.join('\n'));
    return `data:text/plain;base64,${codesb64}`;

  }

  showBackupCodes() {
    const { copied } = this.state;
    const button = <Button onClick={this.copyToClipboard}><Icon name='Copy' size={14}/>Copy</Button>;
    const copyField = copied
      ? <Tooltip content='Copied to clipboard!'>{ button }</Tooltip>
      : button;

    return (
      <div>
        <p><strong>Your shiny new backup codes:</strong></p>
        <ul className="2fa-backup-codes">
          { this.props.codes.map((code) => <li>{code}</li>) }
        </ul>
        <Button download={'backup-codes.txt'} to={this.downloadCodes()}><Icon name='Download' size={14}/>Download</Button>
        { copyField }
      </div>
    );
  }

  render() {
    const {
      onClose,
      open,
      activeCodes,
      error,
      pending,
      codes
    } = this.props;
    const hasCodes = codes.length > 0;

    return (
      <Modal open={open}>
        <Panel title='Generate 2FA Backup Codes' accent>
          <form onSubmit={(e) => e.preventDefault()}>
            <Panel.Section>
              { !hasCodes && <Banner status="warning" >
                Clicking Generate will overwrite the {activeCodes} backup codes
              </Banner> }
              <p>Keep these single-use backup codes somewhere safe but accessible.
                They can be used if your authentication app is unavailable (<span role="img" aria-label="phone in toilet emojis">📱  ➡︎🚽</span> , etc).
              </p>
              <Grid>
                <Grid.Column xs={12} md={6}>
                  { !hasCodes && <TextField required type='password' onChange={this.handleInputChange} placeholder='Password' value={this.state.password} error={(this.state.showErrors && error) ? 'Incorrect Password' : ''} /> }
                  { hasCodes && this.showBackupCodes() }
                </Grid.Column>
              </Grid>
            </Panel.Section>
            <Panel.Section>
              {! hasCodes && <Button type='submit' primary onClick={this.generateCodes}>
                { pending ? 'Generating...' : 'Generate' }
              </Button> }
              { hasCodes && <Button primary onClick={onClose}>Close</Button> }
              { !hasCodes && <Button onClick={onClose} className={styles.Cancel}>Cancel</Button> }
            </Panel.Section>
          </form>
        </Panel>
      </Modal>
    );

  }
}
