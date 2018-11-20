import React from 'react';
import { connect } from 'react-redux';
import { Panel, Button, TextField, Grid } from '@sparkpost/matchbox';
import { VpnKey } from '@sparkpost/matchbox-icons';
import { QRCode } from 'react-qr-svg';
import PanelLoading from 'src/components/panelLoading/PanelLoading';
import styles from './EnableTfaForm.module.scss';
import { getTfaSecret, toggleTfa } from 'src/actions/tfa';
import { showAlert } from 'src/actions/globalAlert';
import EnableTfaFormPropTypes from './EnableTfaForm.propTypes';

export class EnableTfaForm extends React.Component {
  state = {
    code: ''
  };

  componentDidMount() {
    this.props.getTfaSecret();
  }

  handleInputChange = ({ target }) => {
    this.setState({ code: target.value });
  };

  onEnable = () => {
    const { toggleTfa, afterEnable } = this.props;
    const enableIt = toggleTfa({ enabled: true, code: this.state.code });
    if (afterEnable) {
      enableIt.then(this.props.afterEnable);
    }
    return enableIt;
  };

  renderForm() {
    const { onClose, secret, username, togglePending, toggleError } = this.props;
    const qrData = `otpauth://totp/${username}?secret=${encodeURIComponent(
      secret
    )}&issuer=SparkPost`;

    return (
      <form onSubmit={(e) => e.preventDefault()}>
        <Panel.Section>
          <Grid>
            <Grid.Column xs={12} md={7}>
              <h6>Step 1: Configure your 2FA app</h6>
              <p>
                To enable 2FA, you'll need to have a 2FA auth app installed on your phone or tablet
                (examples include Google Authenticator, Duo Mobile, and Authy).
              </p>
              <p>
                Most apps will let you get set up by scanning our QR code from within the app. If
                you prefer, you can type in the key manually.
              </p>
              <p>
                <strong>
                  <VpnKey /> <code>{secret}</code>
                </strong>
              </p>
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
              <p>
                Generate a code from your newly-activated 2FA app to confirm that you're all set up.
              </p>
              <TextField
                required={true}
                data-lpignore={true}
                label="Passcode"
                error={toggleError ? 'Problem verifying your code, please try again' : ''}
                placeholder="Enter a generated 2FA passcode"
                onChange={this.handleInputChange}
                value={this.state.code}
              />
            </Grid.Column>
          </Grid>
        </Panel.Section>
        <Panel.Section>
          <Button type="submit" primary disabled={togglePending} onClick={this.onEnable}>
            {togglePending ? 'Verifying Code...' : 'Enable 2FA'}
          </Button>
          {onClose && (
            <Button disabled={togglePending} onClick={onClose} className={styles.Cancel}>
              Cancel
            </Button>
          )}
        </Panel.Section>
      </form>
    );
  }

  render() {
    if (!this.props.secret) {
      return <PanelLoading />;
    }

    return this.renderForm();
  }
}

EnableTfaForm.propTypes = EnableTfaFormPropTypes;

const mapStateToProps = ({ currentUser, tfa }) => ({
  ...tfa,
  username: currentUser.username,
  enabled: tfa.enabled === true
});

export default connect(
  mapStateToProps,
  {
    getTfaSecret,
    toggleTfa
  }
)(EnableTfaForm);
