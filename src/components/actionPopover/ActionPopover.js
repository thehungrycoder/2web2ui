import React from 'react';
import { Popover, Button, ActionList } from '@sparkpost/matchbox';
import { MoreHoriz } from '@sparkpost/matchbox-icons';

const ActionPopover = ({ actions }) => (
  <Popover left trigger={<Button flat><MoreHoriz size={20}/></Button>}>
    <ActionList actions={actions}/>
  </Popover>
);

export default ActionPopover;
