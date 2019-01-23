import React from 'react';
import { connect } from 'react-redux';
import { currentPlanCodeSelector } from 'src/selectors/accountBillingInfo';
import { usernameSelector } from 'src/selectors/currentUser';
import config from 'src/config';

export class Pendo extends React.Component {
  state = {}

  componentDidUpdate() {
    const { initialised } = this.state;
    const { accessControlReady, accountId, accountSvcLevel, accountPlanCode, username, userAccessLevel } = this.props;
    const pendo = window.pendo;
    const { tenant } = config;

    // One time only
    if (initialised) {
      return;
    }

    // Only if the Pendo client is available (check index.html)
    if (!pendo) {
      return;
    }

    // state.account and state.currentUser are populated iff accessControlReady
    if (!accessControlReady) {
      return;
    }

    pendo.initialize({
      account: {
        id: `${tenant}_${accountId}`,
        tenant,
        plan: accountPlanCode,
        serviceLevel: accountSvcLevel
      },
      visitor: {
        id: `${tenant}_${accountId}_${username}`,
        accessLevel: userAccessLevel
      }
    });

    this.setState({ initialised: true });
  }

  render() {
    return null;
  }
}

const mapStateToProps = (state) => ({
  accessControlReady: state.accessControlReady,
  accountId: state.account.customer_id,
  accountPlanCode: currentPlanCodeSelector(state),
  accountSvcLevel: state.account.service_level,
  username: usernameSelector(state),
  userAccessLevel: state.currentUser.access_level
});

export default connect(mapStateToProps)(Pendo);
