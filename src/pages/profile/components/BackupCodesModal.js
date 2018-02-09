import React, { Component } from 'react';
import Modal from 'src/components/modals/Modal';
import BackupCodes from './BackupCodes';
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
    const hasCodes = this.props.codes.length > 0;
    return (
      <div>
        { !hasCodes && <Button type='submit' disabled={pending} primary onClick={this.generateCodes}>
          { pending ? 'Generating...' : 'Generate' }
        </Button> }
        { hasCodes && <Button primary onClick={onClose}>Close</Button> }
        { !hasCodes && <Button onClick={onClose} className={styles.Cancel}>Cancel</Button> }
      </div>
    );
  }

  render() {
    const {
      open,
      activeCodes,
      error,
      codes
    } = this.props;
    const hasCodes = codes.length > 0;

    return (
      <Modal open={open}>
        <Panel title='Generate Two-factor Backup Codes' accent>
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
                  { hasCodes && <BackupCodes codes={codes} /> }
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
