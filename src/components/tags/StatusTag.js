import React from 'react';
import PropTypes from 'prop-types';
import { Tag, Icon } from '@sparkpost/matchbox';

const StatusTag = ({ status }) => {
  let content = '';
  let icon = null;
  let yellow = false;

  if (status === 'verified') {
    content = 'Verified';
  }

  if (status === 'unverified') {
    content = ' Unverified';
    yellow = true;
    icon = <Icon size={15} name='ErrorOutline'/>;
  }

  if (status === 'blocked') {
    content = ' Blocked';
    yellow = true;
    icon = <Icon size={15} name='ErrorOutline'/>;
  }

  if (status === 'pending') {
    content = ' Pending';
    icon = <Icon size={15} name='ClockOutline'/>;
  }


  return <Tag yellow={yellow}>{icon}{content}</Tag>;
};

StatusTag.propTypes = {
  status: PropTypes.oneOf(['unverified', 'blocked', 'pending', 'verified'])
};

export default StatusTag;
