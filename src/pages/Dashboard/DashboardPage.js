import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Page, Banner } from '@sparkpost/matchbox';
import Layout from '../../components/Layout/Layout';
import UsageReport from '../../components/UsageReport/UsageReport';
import Tutorial from './components/Tutorial';
import EmailBanner from './components/EmailBanner';
import UpgradeBanner from './components/UpgradeBanner';

export class DashboardPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sendingStatus: null
    };
  }

  resendVerfication() {
    // TODO do this in redux
    this.setState({ sendingStatus: 'sending' });
  }

  renderOneCta() {
    const { currentUser } = this.props;

    if (!currentUser['email_verfied']) {
      return (
        <EmailBanner
          sendingStatus={this.state.sendingStatus}
          handleResend={() => this.resendVerfication()} />
      );
    }

    // TODO
    return (
      <UpgradeBanner hasCC />
    );
  }

  renderSuppressionBanner() {
    // TODO suppression get
    // if accountAgeInWeeks > 1 && no suppressions
    return (
      <Banner title="Hey! We noticed you haven't imported a suppression list">
        <p>If you're coming from a previous provider, be sure to also <a>import your suppressions</a>.</p>
      </Banner>
    );
  }

  render() {
    return (
      <Layout.App>
        <Page title='Control Panel'/>

        { this.renderOneCta() }

        <UsageReport />

        { this.renderSuppressionBanner() }

        <Tutorial {...this.props} />

      </Layout.App>
    );
  }
}

export default connect(({ account, currentUser }) => ({ account, currentUser }))(DashboardPage);
