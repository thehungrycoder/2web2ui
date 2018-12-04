import { connect } from 'react-redux';

import {
  getAccountSingleSignOnDetails,
  updateAccountSingleSignOn
} from 'src/actions/accountSingleSignOn';

import { logout } from 'src/actions/auth';

import { update as updateAccount } from 'src/actions/account';

import EnforceTfaPanel from './EnforceTfaPanel';

const mapStateToProps = ({ accountSingleSignOn, account, tfa }) => ({
  loading: accountSingleSignOn.loading,
  ssoEnabled: accountSingleSignOn.enabled,
  tfaRequired: account.tfa_required,
  tfaUpdatePending: account.updateLoading,
  tfaEnabled: tfa.enabled === true
});

const mapDispatchToProps = {
  getAccountSingleSignOnDetails,
  updateAccountSingleSignOn,
  updateAccount,
  logout
};

export default connect(mapStateToProps, mapDispatchToProps)(EnforceTfaPanel);
