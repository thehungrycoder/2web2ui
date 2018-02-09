import { createSelector } from 'reselect';
import qs from 'query-string';
import _ from 'lodash';

const formatSubaccount = ({ compliance_status = 'active', status = 'active', ...rest }) => {
  const compliance = compliance_status !== 'active';

  return {
    compliance,
    status: compliance ? compliance_status : status,
    ...rest
  };
};

export const hasSubaccounts = (state) => state.currentUser.has_subaccounts;

export const selectSubaccounts = (state) => state.subaccounts.list.map((subaccount) => (formatSubaccount(subaccount)));

export const selectSubaccount = ({ subaccounts }) => (formatSubaccount(subaccounts.subaccount));

export const getSubaccountIdFromProps = (state, props) => props.id;
export const getSubaccountIdFromParams = (state, props) => props.match.params.id;
export const selectSubaccountIdFromQuery = (state, props) => qs.parse(props.location.search).subaccount;

/*
 * Selects subaccount object from qp
 * Used to fill in initial values for the subaccount typeahead
 */
export const getSubaccounts = (state) => state.subaccounts.list;
export const selectSubaccountFromQuery = createSelector(
  [getSubaccounts, selectSubaccountIdFromQuery],
  (subaccounts, id) => _.find(subaccounts, { id: Number(id) })
);
