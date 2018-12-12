import React from 'react';
import { Popover, ActionList, Button } from '@sparkpost/matchbox';
import { MoreHoriz } from '@sparkpost/matchbox-icons';

const Actions = ({ actions }) => (
  <div style={{ textAlign: 'right' }}>
    <Popover left trigger={<Button flat><MoreHoriz size={20} /></Button>}>
      <ActionList actions={actions} />
    </Popover>
  </div>
);

export default Actions;
