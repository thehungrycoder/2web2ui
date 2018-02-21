import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import qs from 'query-string';
import { verifyMailboxToken, verifyAbuseToken, verifyPostmasterToken } from 'src/actions/sendingDomains';
import { showAlert } from 'src/actions/globalAlert';
import _ from 'lodash';

// subaccount_id | domain | shared_with_subaccounts | mailbox_at_token | pm_at_token | abuse_at_token
// -------------+---------------+--------------------------------------+-------------------------+----------------------------------+----------------------------------+----------------------------------
//DONE    0 |6164-1.com |0 | ahiugqwjdhvhvhlbhipfjbkugwhbtxyu |                             null |                             null
// DONE  0 |6164-2.com |0 |                             null | utgdhmdhefnumpulcscvteimrrhyccnw |                             null
//   0 |6164-3.com |0 |                             null |                             null | dntsnrngnqwfnszngkqnlsekgqedoxor
//   0 |6164-4.com |1 | tacgdkkjxfwnahptjlmotyglgfniskem |                             null |                             null
//   0 |6164-5.com |1 | kijxzxdmoasbtrozbfmnyryehcivawnk |                             null |                             null
// DONE 101 |6164-6.com |0 |                             null | fwieumrjnjkgazgbfspdjnirqqmqnzbs |                             null
// 101 |6164-7.com |0 | wjwrwnajwlpwkvypootycbpsrcifcjxz |                             null |                             null
//
class VerifyIncomingEmail extends Component {
  // This component mounts within the ListPage's Page components
  // Which means domains have already been loaded
  componentDidMount() {
    this.verifyDomain();
  }

  verifyDomain = () => {
    const { domains, location, verifyMailboxToken, verifyAbuseToken, verifyPostmasterToken } = this.props;
    const { mailbox, domain, token } = qs.parse(location.search);

    // Find the domain to inject subaccount
    const sendingDomain = _.find(domains, { domain });

    if (sendingDomain && mailbox && domain && token) {
      const subaccount = !isNaN(parseInt(sendingDomain.subaccount_id)) ? sendingDomain.subaccount_id : undefined;
      let verifyAction = verifyMailboxToken;

      if (mailbox === 'abuse') {
        verifyAction = verifyAbuseToken;
      }

      if (mailbox === 'postmaster') {
        verifyAction = verifyPostmasterToken;
      }

      return verifyAction({ id: domain, token, subaccount }).catch((err) => {
        showAlert({ type: 'error', message: `Unable to verify ${domain}`, details: err.message });
      });
    }
  }

  componentDidUpdate(prevProps) {
    const { tokenStatus, showAlert } = this.props;

    // Api returns a 200 even if domain has not been verified
    if (!prevProps.tokenStatus && tokenStatus) {
      if (tokenStatus[`${tokenStatus.type}_status`] !== 'valid') {
        showAlert({ type: 'error', message: `Unable to verify ${tokenStatus.domain}` });
      } else {
        showAlert({ type: 'success', message: `${tokenStatus.domain} has been verified` });
      }
    }
  }

  render() {
    return null;
  }
}

const mapStateToProps = (state) => ({
  domains: state.sendingDomains.list,
  tokenStatus: state.sendingDomains.verifyTokenStatus
});

const mapDispatchToProps = { showAlert, verifyMailboxToken, verifyAbuseToken, verifyPostmasterToken };
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(VerifyIncomingEmail));
