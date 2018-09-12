import React from 'react';
import { Panel } from '@sparkpost/matchbox';
import { ArrowForward } from '@sparkpost/matchbox-icons';
import ConfirmationModal from 'src/components/modals/ConfirmationModal';
import LabelledValue from 'src/components/labelledValue/LabelledValue';
import PageLink from 'src/components/pageLink/PageLink';

export class StatusSection extends React.Component {
  state = {
    isDisabling: false,
    isModalOpen: false
  }

  componentDidUpdate(prevProps) {
    const { updateError, updatedAt } = this.props;

    if (updatedAt !== prevProps.updatedAt) {
      this.setState({ isDisabling: false, isModalOpen: false });
    }

    if (this.state.isDisabling && updateError) {
      this.setState({ isDisabling: false });
    }
  }

  cancel = () => {
    this.setState({ isModalOpen: false });
  }

  disable = () => {
    const { cert, provider } = this.props;

    this.props.updateAccountSingleSignOn({ cert, enabled: false, provider });
    this.setState({ isDisabling: true });
  }

  enable = () => {
    const { cert, provider } = this.props;
    this.props.updateAccountSingleSignOn({ cert, enabled: true, provider });
  }

  toggle = () => {
    if (this.props.enabled) {
      this.setState({ isModalOpen: true });
    } else {
      this.enable();
    }
  }

  render() {
    const { enabled, provider } = this.props;

    if (!provider) {
      return null;
    }

    return (
      <Panel.Section
        actions={[{
          color: 'orange',
          content: enabled ? 'Disable SSO' : 'Enable SSO',
          onClick: this.toggle
        }]}
      >
        <LabelledValue label="Status">
          <h6>{enabled ? 'Enabled' : 'Disabled'}</h6>
          {enabled && (
            <p>
              <PageLink to="/account/users">
                Manage single sign-on users <ArrowForward/>
              </PageLink>
            </p>
          )}
        </LabelledValue>
        <ConfirmationModal
          confirming={this.state.isDisabling}
          open={this.state.isModalOpen}
          title="Are you sure you want to disable Single Sign-On?"
          content={
            <p>This will disable Single Sign-On for all your users.</p>
          }
          confirmVerb="Disable"
          onCancel={this.cancel}
          onConfirm={this.disable}
        />
      </Panel.Section>
    );
  }
}

export default StatusSection;
