import React from 'react';
import ActionPopover from 'src/components/actionPopover';
import PageLink from 'src/components/pageLink';
import { setSubaccountQuery } from 'src/helpers/subaccounts';

const ActionsTableData = ({ id, subaccount_id: subaccountId, openDeleteModal }) => (
  <ActionPopover
    actions={[
      {
        Component: PageLink,
        content: 'Edit',
        to: `/snippets/edit/${id}${setSubaccountQuery(subaccountId)}`
      },
      {
        Component: PageLink,
        content: 'Duplicate',
        to: {
          pathname: '/snippets/create',
          state: { id, subaccountId }
        }
      },
      {
        content: 'Delete',
        onClick: () => openDeleteModal({ id, subaccountId })
      }
    ]}
  />
);

export default ActionsTableData;
