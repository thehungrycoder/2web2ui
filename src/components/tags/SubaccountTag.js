import React from 'react';
import PropTypes from 'prop-types';
import { Tag, Icon } from '@sparkpost/matchbox';

const SubaccountTag = ({ id, all, receiveAll, master, isDefault }) => {
  let content = `Subaccount ${id}`;
  let color = null;
  let defaultContent = null;

  if (isDefault) {
    defaultContent = ' (Default)';
    color = 'orange';
  }

  if (all) {
    content = 'Shared with all';
  }

  // Used for webhooks
  if (receiveAll) {
    content = 'All';
  }

  if (master) {
    content = 'Master account';
  }

  return <Tag color={color}><Icon name='Link' size={15} /> {content}{defaultContent}</Tag>;
};

SubaccountTag.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  all: PropTypes.bool,
  master: PropTypes.bool,
  isDefault: PropTypes.bool,
  receiveAll: PropTypes.bool
};

export default SubaccountTag;
