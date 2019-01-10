import React from 'react';
import { Tooltip } from '@sparkpost/matchbox';
import styles from './Legend.module.scss';

const Item = ({ label, fill = 'whitesmoke', tooltipContent }) => {
  const content = (
    <div className={styles.Item}>
      <span className={styles.Fill} style={{ background: fill }}/>
      <span className={styles.Label}>{label}</span>
    </div>
  );

  if (tooltipContent) {
    return (
      <Tooltip content={tooltipContent(label)} dark>
        {content}
      </Tooltip>
    );
  }

  return content;
};

const Legend = ({ items, tooltipContent }) => (
  <div>
    {items.map((item, i) => <Item key={i} tooltipContent={tooltipContent} {...item} />)}
  </div>
);

export default Legend;
