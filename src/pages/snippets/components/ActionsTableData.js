import React from 'react';
import ActionPopover from 'src/components/actionPopover';
import PageLink from 'src/components/pageLink';
import { setSubaccountQuery } from 'src/helpers/subaccounts';

const ActionsTableData = ({ id, subaccount_id, toggleDelete, canCreate }) => (
  <ActionPopover
    actions={[
      {
        Component: PageLink,
        content: 'Edit',
        to: `/snippets/edit/${id}${setSubaccountQuery(subaccount_id)}`,
        section: 1
      },
      {
        content: 'Delete',
        section: 2,
        visible: canCreate,
        onClick: () => toggleDelete(id, subaccount_id)
      }
    ]}
  />
);

export default ActionsTableData;
