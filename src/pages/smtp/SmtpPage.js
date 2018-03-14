import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Page, Panel } from '@sparkpost/matchbox';
import SmtpDetails from 'src/components/smtpDetails/SmtpDetails';
import DefaultTrackingForm from './components/TrackingToggle';
import { update as updateAccount } from 'src/actions/account';
import { showAlert } from 'src/actions/globalAlert';

export class SmtpPage extends Component {

  toggleTracking = () => {
    const { updateAccount, showAlert } = this.props;
    const { account: { options: { smtp_tracking_default }}} = this.props;
    const body = {
      options: {
        smtp_tracking_default: !smtp_tracking_default
      }
    };

    return updateAccount(body)
      .then(() => showAlert({
        type: 'success',
        message: 'Default SMTP Engagement Tracking updated.'
      }));
  };

  render() {
    return (
      <Page title='SMTP Relay'>
        <Panel sectioned accent><SmtpDetails /></Panel>
        <DefaultTrackingForm toggle={this.toggleTracking} />
      </Page>
    );

  }
}


const mapStateToProps = ({ account }) => ({
  account
});
export default connect(mapStateToProps, { updateAccount, showAlert })(SmtpPage);
