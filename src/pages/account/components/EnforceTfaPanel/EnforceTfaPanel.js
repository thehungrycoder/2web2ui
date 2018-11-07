import React from 'react';
import PanelLoading from 'src/components/panelLoading/PanelLoading';
import ConfirmationModal from 'src/components/modals/ConfirmationModal';
import TogglePanel from './TogglePanel';

export class EnforceTFAPanel extends React.Component {
  state = {
    enforced: false,
    updating: false,
    disableSsoModal: false,
    enableModal: false,
    disableModal: false
  };

  componentDidMount() {
    this.props.getAccountSingleSignOnDetails();
  }

  toggleTfaRequired = () => {
    const { ssoEnabled, tfaRequired } = this.props;

    if (tfaRequired) {
      this.setState({ disableModal: true });
    } else if (ssoEnabled) {
      // Offer to disable SSO before requiring TFA
      this.setState({ disableSsoModal: true });
    } else {
      this.setState({ enableModal: true });
    }
  };

  disableSso = () => {
    const { ssoCert, ssoProvider } = this.props;
    this.props
      .updateAccountSingleSignOn({
        cert: ssoCert,
        provider: ssoProvider,
        enabled: false
      })
      .then(() => {
        this.setState({
          disableSsoModal: false,
          enableModal: true
        });
      });
  };

  setTfaRequired = (value) => {
    this.props.updateAccount({ tfa_required: value }).then(() => {
      this.setState({ enableModal: false, disableModal: false });
    });
  };

  onCancel = () =>
    this.setState({
      disableSsoModal: false,
      enableModal: false,
      disableModal: false
    });

  render() {
    const {
      loading,
      tfaRequired,
      tfaUpdatePending,
      ssoUpdatePending
    } = this.props;

    const { disableSsoModal, enableModal, disableModal } = this.state;

    if (loading) {
      return <PanelLoading />;
    }

    return (
      <React.Fragment>
        <TogglePanel
          tfaRequired={tfaRequired}
          toggleTfaRequired={this.toggleTfaRequired}
        />
        <ConfirmationModal
          open={disableSsoModal}
          confirming={ssoUpdatePending}
          title="Single sign-on must be disabled before enforcing two-factor authentication on this account. Disable?"
          content={
            <React.Fragment>
              <p>
                For users to perform two-factor authentication, they must log in
                directly and not through a single sign-on identity provider.
              </p>
              <p>
                After disabling single sign-on, you will be prompted to enforce
                two-factor authentication account-wide.
              </p>
            </React.Fragment>
          }
          confirmVerb="Disable Single Sign-on"
          onCancel={this.onCancel}
          onConfirm={this.disableSso}
        />
        <ConfirmationModal
          open={enableModal}
          confirming={tfaUpdatePending}
          title="Are you sure you want to enforce two-factor authentication for this account?"
          content={
            <React.Fragment>
              <p>
                Enforcing two-factor authentication account-wide will have the
                following effects:
              </p>
              <ul>
                <li>
                  All users without two-factor authentication enabled will be
                  forced to login to the UI again and enable it on login.
                </li>
                <li>
                  All users will be sent an email informing them of this change.
                </li>
              </ul>
            </React.Fragment>
          }
          onCancel={this.onCancel}
          onConfirm={() => this.setTfaRequired(true)}
        />
        <ConfirmationModal
          open={disableModal}
          confirming={tfaUpdatePending}
          title="Are you sure you want to make two-factor authentication optional for this account?"
          content={
            <React.Fragment>
              <p>
                Making two-factor authentication optional will allow users to
                manage their own two-factor authentication settings.
              </p>
              <p>
                Note: This will <em>not</em> disable two-factor authentication
                for any user.
              </p>
            </React.Fragment>
          }
          onCancel={this.onCancel}
          onConfirm={() => this.setTfaRequired(false)}
        />
      </React.Fragment>
    );
  }
}

export default EnforceTFAPanel;
