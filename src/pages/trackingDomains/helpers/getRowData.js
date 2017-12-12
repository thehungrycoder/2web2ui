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

const linkColumn = (domain, isDefault) => (
  <div>
    <Link to={`/account/trackingDomains/${domain}`}>{domain}</Link>
    { isDefault && ' (default)' }
  </div>
);

/*
 Tracking Domains getRowData passed to TableCollection in ListPage.
*/
export const getRowData = (trackingDomain) => {
  const { domain, status } = trackingDomain;
  return [
    linkColumn(domain, trackingDomain.default),
    resolveStatus(status)
  ];
};

export const getRowDataWithSubaccount = (trackingDomain) => {
  const { domain, status, subaccount_id } = trackingDomain;
  return [
    linkColumn(domain, trackingDomain.default),
    resolveStatus(status),
    subaccount_id ? subaccount_id : null
  ];
};
