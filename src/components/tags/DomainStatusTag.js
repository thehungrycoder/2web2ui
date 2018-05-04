import React from 'react';
import PropTypes from 'prop-types';
import { Tag, Tooltip } from '@sparkpost/matchbox';
import { ErrorOutline, Schedule } from '@sparkpost/matchbox-icons';

const DomainStatusTag = ({ status, className }) => {
  const size = 15;

  if (status === 'verified') {
    return <Tag>Verified</Tag>;
  }

  if (status === 'unverified') {
    return (
      <Tooltip
        content='This domain must be verified before use.'
        dark>
        <Tag className={className} color='yellow'><ErrorOutline size={size} /> Unverified</Tag>
      </Tooltip>
    );
  }

  if (status === 'blocked') {
    return (
      <Tooltip
        content='This domain is not available for use. For more information, please contact support.'
        dark>
        <Tag className={className} color='red'><ErrorOutline size={size} /> Blocked</Tag>
      </Tooltip>
    );
  }

  if (status === 'pending') {
    return (
      <Tooltip
        content='This domain is pending review, please check back again soon.'
        dark>
        <Tag className={className}><Schedule size={size} /> Pending</Tag>
      </Tooltip>
    );
  }

  return null;
};

DomainStatusTag.propTypes = {
  status: PropTypes.oneOf(['unverified', 'blocked', 'pending', 'verified', null])
};

export default DomainStatusTag;
