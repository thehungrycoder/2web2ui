import { connect } from 'react-redux';

import {
  getAccountSingleSignOnDetails,
  updateAccountSingleSignOn
} from 'src/actions/accountSingleSignOn';

import { update as updateAccount } from 'src/actions/account';

import EnforceTfaPanel from './EnforceTfaPanel';

const mapStateToProps = ({ accountSingleSignOn, account }) => ({
  loading: accountSingleSignOn.loading,
  ssoUpdatePending: accountSingleSignOn.updating,
  ssoEnabled: accountSingleSignOn.enabled,
  ssoCert: accountSingleSignOn.cert,
  ssoProvider: accountSingleSignOn.provider,
  tfaRequired: account.tfa_required,
  tfaUpdatePending: account.updateLoading
});

const mapDispatchToProps = {
  getAccountSingleSignOnDetails,
  updateAccountSingleSignOn,
  updateAccount
};

export default connect(mapStateToProps, mapDispatchToProps)(EnforceTfaPanel);
