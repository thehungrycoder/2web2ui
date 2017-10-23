import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Page, Banner } from '@sparkpost/matchbox';
import { UsageReport } from 'src/components';
import Tutorial from './components/Tutorial';
import EmailBanner from './components/EmailBanner';
import UpgradeBanner from './components/UpgradeBanner';

import { AccessControl } from 'src/components/auth';
import { configFlag } from 'src/helpers/conditions';

export class DashboardPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sendingStatus: null
    };
  }

  resendVerification() {
    // TODO do this in redux
    this.setState({ sendingStatus: 'sending' });
  }

  renderOneCta() {
    const { currentUser } = this.props;

    if (!currentUser['email_verified']) {
      return (
        <EmailBanner
          sendingStatus={this.state.sendingStatus}
          handleResend={() => this.resendVerification()} />
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
      <div>
        <Page title='Control Panel'/>

        { this.renderOneCta() }

        <AccessControl condition={configFlag('showThingOnDash')}>
          <h1>Show a thing on the dashboard based on config</h1>
        </AccessControl>

        <UsageReport />

        { this.renderSuppressionBanner() }

        <Tutorial {...this.props} />
      </div>
    );
  }
}

export default connect(({ account, currentUser }) => ({ account, currentUser }))(DashboardPage);
