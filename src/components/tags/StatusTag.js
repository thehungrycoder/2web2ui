import React from 'react';
import PropTypes from 'prop-types';
import { Tag, Icon } from '@sparkpost/matchbox';

const StatusTag = ({ unverified, blocked, pending }) => {
  let content = '';
  let icon = null;

  if (unverified) {
    content = 'Unverified';
    <Icon name='Warning'/>;
  }

  if (blocked) {
    content = 'Blocked';
    icon = <Icon name='Error'/>;
  }

  if (pending) {
    content = 'Pending';
    icon = <Icon name='Clock'/>;
  }

  return <Tag yellow={unverified || blocked}>{icon}{content}</Tag>;
};

StatusTag.propTypes = {
  unverified: PropTypes.bool,
  blocked: PropTypes.bool,
  pending: PropTypes.bool
};

export default StatusTag;
