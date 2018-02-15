import React, { Component } from 'react';
import Modal from 'src/components/modals/Modal';
import BackupCodesView from './BackupCodesView';
import { Panel, TextField, Banner, Button, Grid } from '@sparkpost/matchbox';
import styles from './TfaModals.module.scss';
const initialState = {
  password: '',
  showErrors: false
};

export default class BackupCodesModal extends Component {
  state = initialState;

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

  renderButtons = () => {
    const { pending, onClose } = this.props;
    const generatedCodes = this.props.codes.length > 0;
    if (generatedCodes) {
      return (
        <div>
          <Button primary onClick={onClose}>Close</Button>
        </div>
      );
    } else {
      return (
        <div>
          <Button type='submit' disabled={pending} primary onClick={this.generateCodes}>
            { pending ? 'Generating...' : 'Generate' }
          </Button>
          <Button onClick={onClose} className={styles.Cancel}>Cancel</Button>
        </div>
      );

    }
  }

  render() {
    const {
      open,
      activeCount,
      error,
      codes
    } = this.props;
    const generatedCodes = codes.length > 0;
    const hasCodes = activeCount > 0;

    return (
      <Modal open={open}>
        <Panel title='Generate Two-factor Backup Codes' accent>
          <form onSubmit={(e) => e.preventDefault()}>
            <Panel.Section>
              { !generatedCodes && hasCodes && <Banner status="warning" >
                Clicking Generate will overwrite your existing {activeCount} active backup codes.
              </Banner> }
              <p>Keep these single-use backup codes somewhere safe but accessible.
                They can be used if your authentication app is unavailable (<span role="img" aria-label="phone in toilet emojis">📱  ➡︎🚽</span> , etc).
              </p>
              <Grid>
                <Grid.Column xs={12} md={6}>
                  { !generatedCodes && <TextField required type='password' onChange={this.handleInputChange} placeholder='Password' value={this.state.password} error={(this.state.showErrors && error) ? 'Incorrect Password' : ''} /> }
                  { generatedCodes && <BackupCodesView codes={codes} /> }
                </Grid.Column>
              </Grid>
            </Panel.Section>
            <Panel.Section>
              { this.renderButtons() }
            </Panel.Section>
          </form>
        </Panel>
      </Modal>
    );

  }
}
