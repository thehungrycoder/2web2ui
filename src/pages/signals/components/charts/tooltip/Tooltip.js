import React from 'react';
import PropTypes from 'prop-types';
import { formatDate } from 'src/helpers/date';
import styles from './Tooltip.module.scss';
import _ from 'lodash';
import './Tooltip.scss';

const Tooltip = ({ children, width, ...props }) => {
  const content = _.get(props, 'payload[0]', {});
  const date = _.get(content, 'payload.date');

  return (
    <div className={styles.TooltipWrapper} style={{ width }}>
      {date && (
        <div className={styles.TooltipDate}>
          {formatDate(date)}
        </div>
      )}
      <div className={styles.TooltipContent}>
        {children(content)}
      </div>
    </div>
  );
};

const defaultChildren = ({ value }) => value;

Tooltip.propTypes = {
  children: PropTypes.func,
  width: PropTypes.string
};

Tooltip.defaultProps = {
  children: defaultChildren,
  width: '200px'
};

export default Tooltip;
