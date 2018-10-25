import React from 'react';
import { NameCell } from 'src/components/collection';
import { setSubaccountQuery } from 'src/helpers/subaccounts';

const NameTableData = ({ id, name, subaccount_id }) => (
  <NameCell
    id={id}
    name={name}
    to={`/snippets/edit/${id}${setSubaccountQuery(subaccount_id)}`}
  />
);

export default NameTableData;
