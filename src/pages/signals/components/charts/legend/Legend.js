import React from 'react';
import styles from './Legend.module.scss';

const Item = ({ label, fill = 'whitesmoke', tooltipContent }) => (
  <div className={styles.Item}>
    <span className={styles.Fill} style={{ background: fill }}/>
    <span className={styles.Label}>{label}</span>
  </div>
);


const Legend = ({ items }) => (
  <div>
    {items.map((item, i) => <Item key={i} {...item} />)}
  </div>
);

export default Legend;
