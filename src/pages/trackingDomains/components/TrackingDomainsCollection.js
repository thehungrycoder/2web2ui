import React from 'react';
import TableCollection from 'src/components/collection/TableCollection';

import TrackingDomainsListHeader from './TrackingDomainsListHeader';

import { getRowData, getRowDataWithSubaccount } from '../helpers/getRowData';

const TrackingDomainsCollection = ({ rows, hasSubaccounts }) => {
  const columns = hasSubaccounts ? ['Domain', 'Status', 'Subaccount'] : ['Domain', 'Status'];

  return (
    <div>
      <TrackingDomainsListHeader />
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
