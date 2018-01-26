import { createSelector } from 'reselect';
import { Link } from 'react-router-dom';
import qs from 'query-string';

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
export const getSubaccountIdFromQuery = (props) => qs.parse(props.location.search).subaccount;

export const selectDetailTabs = createSelector(
  [getSubaccountIdFromParams],
  (id) => ([
    {
      content: 'Details',
      Component: Link,
      to: `/account/subaccounts/${id}`
    },
    {
      content: 'API Keys',
      Component: Link,
      to: `/account/subaccounts/${id}/api-keys`
    }
  ])
);
