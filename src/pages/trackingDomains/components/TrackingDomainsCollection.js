import React from 'react';

import TableCollection from 'src/components/collection/TableCollection';
import { getRowData, getRowDataWithSubaccount } from '../helpers/getRowData';

const TrackingDomainsCollection = ({ rows, hasSubaccounts }) => {
  const columns = hasSubaccounts ? ['Domain', 'Status', 'Subaccount'] : ['Domain', 'Status'];

  return (
    <TableCollection
      columns={columns}
      getRowData={ hasSubaccounts ? getRowDataWithSubaccount : getRowData }
      pagination={true}
      rows={rows}
      filterBox={{
        show: true,
        exampleModifiers: ['domain', 'status'], // TODO status won't work because it's an object, needs to be transformed in selector
        itemToStringKeys: ['domain', 'subaccount_id']
      }}
    />
  );
};

export default TrackingDomainsCollection;


// keyMap: { role: 'access' },
// exampleModifiers: ['name', 'email', 'role'],
// itemToStringKeys: ['username', 'name', 'email']
