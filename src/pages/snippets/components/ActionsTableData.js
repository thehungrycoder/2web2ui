import React from 'react';
import ActionPopover from 'src/components/actionPopover';
import PageLink from 'src/components/pageLink';
import { setSubaccountQuery } from 'src/helpers/subaccounts';

const ActionsTableData = ({ id, subaccount_id }) => (
  <ActionPopover
    actions={[
      {
        Component: PageLink,
        content: 'Edit',
        to: `/snippets/edit/${id}${setSubaccountQuery(subaccount_id)}`
      }
    ]}
  />
);

export default ActionsTableData;
