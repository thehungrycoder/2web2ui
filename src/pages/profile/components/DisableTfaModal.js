import React, { Component } from 'react';
import Modal from 'src/components/modals/Modal';
import { Panel, Button, TextField, Grid } from '@sparkpost/matchbox';

export default class EnableTfaModal extends Component {

  state = {
    password: '',
    showErrors: false
  };

  componentDidUpdate(oldProps) {
    if (!this.props.enabled && this.props.open) {
      this.props.onClose();
    }
    if (oldProps.open && !this.props.open) {
      this.setState({
        password: '',
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
    this.setState({ password: target.value });
  }

  render() {
    const { open, onClose, togglePending, toggleError } = this.props;

    return (
      <Modal open={open}>
        <Panel title='Disable Two-Factor Authentication' accent actions={[{ content: 'Close', onClick: onClose }]}>
          <Panel.Section>
            <p>Enter your SparkPost password to disable two-factor authentication.</p>
            <Grid>
              <Grid.Column xs={12} md={6}>
                <TextField type='password' error={(this.state.showErrors && toggleError) ? 'Incorrect password' : ''} placeholder='Enter your password' onChange={this.handleInputChange} value={this.state.password} />
              </Grid.Column>
            </Grid>
          </Panel.Section>
          <Panel.Section>
            <Button primary onClick={() => this.props.disable(this.state.password)}>
              {togglePending ? 'Disabling...' : 'Disable 2FA'}
            </Button>
          </Panel.Section>
        </Panel>
      </Modal>
    );
  }

}
