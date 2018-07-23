import React from 'react';
import { Tag } from '@sparkpost/matchbox';
import { snakeToFriendly } from 'src/helpers/string';

const StatusTag = ({ status }) => {
  let tagColor = null;

  if (status === 'running') {
    tagColor = 'yellow'
  }

  if (status === 'completed') {
    tagColor = 'navy'
  }

  return <Tag color={tagColor}>{snakeToFriendly(status)}</Tag>;
}

export default StatusTag;
