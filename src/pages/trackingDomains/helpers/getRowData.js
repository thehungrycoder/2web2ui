import React from 'react';
import { Link } from 'react-router-dom';

/*
 Tracking Domains getRowData passed to TableCollection in ListPage.
 TODO: this needs to be a Table.Row component to better handle hasSubaccounts
*/
const getRowData = ({ domain, status, subaccount_id }) => ([
  <Link to={`/account/trackingDomains/${domain}`}>{domain}</Link>,
  status.verified ? 'verified' : 'unverified',
  subaccount_id ? subaccount_id : null
]);

export default getRowData;
