import React from 'react';
import classnames from 'classnames/bind';
import styles from './Typeahead.module.scss';
classnames.bind(styles);

const SubaccountTypeaheadItem = ({ name, id }) => (
  <div className={styles.Item}>
    {name}
    <span className={styles.id}>{id}</span>
  </div>
);

export default SubaccountTypeaheadItem;
