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
    const {
      cert,
      enabled,
      loading,
      provider,
      updateAccountSingleSignOn,
      updateError,
      updatedAt
    } = this.props;

    if (loading) {
      return <PanelLoading minHeight="130px" />;
    }

    return (
      <React.Fragment>
        <ProviderSection provider={provider} />
        <StatusSection
          cert={cert}
          enabled={enabled}
          provider={provider}
          updateAccountSingleSignOn={updateAccountSingleSignOn}
          updateError={updateError}
          updatedAt={updatedAt}
        />
      </React.Fragment>
    );
  }

  render() {
    return (
      <Panel
        title="Single Sign-On"
        actions={[{
          color: 'orange',
          component: ExternalLink,
          content: 'Learn More',
          to: LINKS.SSO_GUIDE
        }]}
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

const mapStateToProps = ({ accountSingleSignOn }) => accountSingleSignOn;

export default connect(mapStateToProps, mapDispatchToProps)(SingleSignOnPanel);
