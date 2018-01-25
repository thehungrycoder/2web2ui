import React from 'react';
import PropTypes from 'prop-types';
import { Tag } from '@sparkpost/matchbox';

import styles from './ReadyFor.module.scss';

const ReadyFor = ({ bounce, dkim, sending, bounceDefault, showLabel = true }) => {
  let bounceMarkup = null;

  if (!bounce && !dkim && !sending) {
    return null;
  }

  if (bounce) {
    bounceMarkup = bounceDefault
      ? <Tag color='orange'>Bounce (Default)</Tag>
      : <Tag>Bounce</Tag>;
  }

  const sendingMarkup = sending
    ? <Tag>Sending</Tag>
    : null;

  const dkimMarkup = dkim
    ? <Tag>DKIM Signing</Tag>
    : null;

  return (
    <span className={styles.ReadyFor}>
      { showLabel && <small>Ready For:</small> }
      {sendingMarkup}{bounceMarkup}{dkimMarkup}
    </span>
  );
};

ReadyFor.propTypes = {
  bounce: PropTypes.bool,
  sending: PropTypes.bool,
  dkim: PropTypes.bool,
  bounceDefault: PropTypes.bool
};

export default ReadyFor;
