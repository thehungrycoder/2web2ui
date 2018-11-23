import React from 'react';
import { Panel } from '@sparkpost/matchbox';
import PanelLoading from 'src/components/panelLoading/PanelLoading';
import { ConfirmationModal } from 'src/components/modals';
import TogglePanel from './TogglePanel';
import ExternalLink from 'src/components/externalLink/ExternalLink';
import { LINKS } from 'src/constants';

export class EnforceTFAPanel extends React.Component {
  state = {
    enforced: false,
    updating: false,
    enableModal: false,
    disableModal: false
  };

  componentDidMount() {
    this.props.getAccountSingleSignOnDetails();
  }

  toggleTfaRequired = () => {
    const { tfaRequired } = this.props;

    if (tfaRequired) {
      this.setState({ disableModal: true });
    } else {
      this.setState({ enableModal: true });
    }
  };

  setTfaRequired = (value) => {
    this.props.updateAccount({ tfa_required: value }).then(() => {
      this.setState({ enableModal: false, disableModal: false });
    });
  };

  onCancel = () =>
    this.setState({
      enableModal: false,
      disableModal: false
    });

  render() {
    const { loading, tfaRequired, tfaUpdatePending, ssoEnabled } = this.props;
    const { enableModal, disableModal } = this.state;

    if (loading) {
      return <PanelLoading />;
    }

    return (
      <Panel
        title="Two-factor Authentication"
        actions={[
          {
            color: 'orange',
            content: 'Learn more',
            component: ExternalLink,
            to: LINKS.MANDATORY_TFA
          }
        ]}
      >
        {ssoEnabled && (
          <Panel.Section>
            <p>
              Mandatory two-factor authentication is not available while single sign-on is enabled.
            </p>
          </Panel.Section>
        )}
        <TogglePanel readOnly={ssoEnabled} tfaRequired={tfaRequired} toggleTfaRequired={this.toggleTfaRequired} />
        <ConfirmationModal
          open={enableModal}
          confirming={tfaUpdatePending}
          title="Are you sure you want to enforce two-factor authentication for this account?"
          content={
            <React.Fragment>
              <p>
                Enforcing two-factor authentication account-wide will have the following effects:
              </p>
              <ul>
                <li>
                  All users without two-factor authentication enabled will be forced to login to the
                  UI again and enable it on login.
                </li>
                <li>
                  All users without two-factor authentication enabled will be sent an email
                  informing them of this change.
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
                Making two-factor authentication optional will allow users to manage their own
                two-factor authentication settings.
              </p>
              <p>
                Note: This will <em>not</em> disable two-factor authentication for any user.
              </p>
            </React.Fragment>
          }
          onCancel={this.onCancel}
          onConfirm={() => this.setTfaRequired(false)}
        />
      </Panel>
    );
  }
}

export default EnforceTFAPanel;
