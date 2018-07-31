import React from 'react';
import styles from './Typeahead.module.scss';

const TemplateTypeaheadItem = ({ id }) => (
  <div className={styles.Item}>{id}</div>
);

export default TemplateTypeaheadItem;
