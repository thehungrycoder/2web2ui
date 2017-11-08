// import _ from 'lodash';
// import { createSelector } from 'reselect';

const resolveStatus = (status, compliance_status) => {
  // Defensive status check for when it's not there
  if (status && compliance_status === 'active') {
    return status;
  } else {
    return compliance_status;
  }
};

export const hasSubaccounts = (state) => state.currentUser.has_subaccounts;

// TODO: do in reducer?
export const getSubaccounts = (state) => state.subaccounts.list.map((subaccount) => {
  const formatted = { ...subaccount };
  formatted.status = resolveStatus(subaccount.status, subaccount.compliance_status);
  return formatted;
});

export const getSubaccount = ({ subaccounts }) => {

  const formatted = { ...subaccounts.subaccount };
  formatted.status = resolveStatus(formatted.status, formatted.compliance_status);
  return formatted;
};

export const getSubaccountIdFromProps = (state, props) => props.id;
