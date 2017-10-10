import React from 'react';
import { Link } from 'react-router-dom';

const resolveStatus = ({ verified, compliance_status }) => {
  if (verified) {
    if (compliance_status === 'valid') {
      return 'verified';
    } else {
      return compliance_status;
    }
  } else {
    return 'unverified';
  }
};

/*
 Tracking Domains getRowData passed to TableCollection in ListPage.
*/
const getRowData = ({ domain, status, subaccount_id }) => ([
  <Link to={`/account/trackingDomains/${domain}`}>{domain}</Link>,
  resolveStatus(status),
  subaccount_id ? subaccount_id : null
]);


export default getRowData;
