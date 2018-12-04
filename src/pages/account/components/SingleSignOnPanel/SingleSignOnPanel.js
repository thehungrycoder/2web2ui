import React from 'react';
import { connect } from 'react-redux';
import { Panel } from '@sparkpost/matchbox';
import {
  getAccountSingleSignOnDetails,
  updateAccountSingleSignOn
} from 'src/actions/accountSingleSignOn';
import ExternalLink from 'src/components/externalLink/ExternalLink';
import PanelLoading from 'src/components/panelLoading/PanelLoading';
import { LINKS } from 'src/constants';
import ProviderSection from './ProviderSection';
import StatusSection from './StatusSection';

export class SingleSignOnPanel extends React.Component {
  componentDidMount() {
    this.props.getAccountSingleSignOnDetails();
  }

  renderContents() {
    const { loading, provider, tfaRequired } = this.props;

    if (loading) {
      return <PanelLoading minHeight="130px" />;
    }

    return (
      <React.Fragment>
        {tfaRequired && (
          <Panel.Section>
            <p>
              Single sign-on is not available while two-factor authentication is required on this
              account.
            </p>
          </Panel.Section>
        )}
        <ProviderSection readOnly={tfaRequired} provider={provider} />
        <StatusSection readOnly={tfaRequired} {...this.props} />
      </React.Fragment>
    );
  }

  render() {
    return (
      <Panel
        title="Single Sign-On"
        actions={[
          {
            color: 'orange',
            component: ExternalLink,
            content: 'Learn More',
            to: LINKS.SSO_GUIDE
          }
        ]}
      >
        {this.renderContents()}
      </Panel>
    );
  }
}

const mapDispatchToProps = {
  getAccountSingleSignOnDetails,
  updateAccountSingleSignOn
};

const mapStateToProps = ({ account, accountSingleSignOn }) => ({
  ...accountSingleSignOn,
  tfaRequired: account.tfa_required
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SingleSignOnPanel);
