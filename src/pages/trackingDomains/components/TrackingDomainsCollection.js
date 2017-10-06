import React from 'react';
import TableCollection from 'src/components/collection/TableCollection';

import TrackingDomainsListHeader from './TrackingDomainsListHeader';

import getRowData from '../helpers/getRowData';

const TrackingDomainsCollection = ({ rows, hasSubaccounts }) => {
  const columns = ['Domain', 'Status'];

  if (hasSubaccounts) {
    columns.push('Subaccount');
  }

  return (
    <div>
      <TrackingDomainsListHeader />
      <TableCollection
        columns={columns}
        getRowData={getRowData}
        pagination={true}
        rows={rows}
      />
    </div>
  );
};

export default TrackingDomainsCollection;
