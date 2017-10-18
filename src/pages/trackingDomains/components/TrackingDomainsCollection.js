import React from 'react';
import { Link } from 'react-router-dom';

import { Page } from '@sparkpost/matchbox';
import TableCollection from 'src/components/collection/TableCollection';

import { getRowData, getRowDataWithSubaccount } from '../helpers/getRowData';

const primaryAction = {
  content: 'Create Tracking Domain',
  Component: Link,
  to: '/account/tracking-domains/create'
};

const TrackingDomainsCollection = ({ rows, hasSubaccounts }) => {
  const columns = hasSubaccounts ? ['Domain', 'Status', 'Subaccount'] : ['Domain', 'Status'];

  return (
    <div>
      <Page title='Tracking Domains' primaryAction={primaryAction}/>
      <TableCollection
        columns={columns}
        getRowData={ hasSubaccounts ? getRowDataWithSubaccount : getRowData }
        pagination={true}
        rows={rows}
      />
    </div>
  );
};

export default TrackingDomainsCollection;
