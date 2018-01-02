import React from 'react';
import PropTypes from 'prop-types';
import { Tag, Icon } from '@sparkpost/matchbox';

const SubaccountTag = ({ id, all, master, isDefault }) => {
  const defaultContent = isDefault ? ' (Default)' : null;
  let content = `Subaccount ${id}`;

  if (all) {
    content = 'Shared with all';
  }

  if (master) {
    content = 'Master account';
  }

  return <Tag orange={isDefault}><Icon name='Link' size={15} /> {content}{defaultContent}</Tag>;
};

SubaccountTag.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  all: PropTypes.bool,
  master: PropTypes.bool
};

export default SubaccountTag;
