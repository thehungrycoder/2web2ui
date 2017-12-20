import React from 'react';
import PropTypes from 'prop-types';
import { Tag } from '@sparkpost/matchbox';

import styles from './ReadyFor.module.scss';

const ReadyFor = ({ bounce, dkim, sending, bounceDefault }) => {
  let bounceMarkup = null;

  if (!bounce && !dkim && !sending) {
    return null;
  }

  if (bounce) {
    bounceMarkup = bounceDefault
      ? <Tag orange>Bounce (Default)</Tag>
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
      <small>Ready For:</small>
      {sendingMarkup}{bounceMarkup}{dkimMarkup}
    </span>
  );
};

ReadyFor.propTypes = {
  bounce: PropTypes.bool.isRequired,
  sending: PropTypes.bool.isRequired,
  dkim: PropTypes.bool.isRequired,
  bounceDefault: PropTypes.bool
};

export default ReadyFor;
