import React from 'react';
import classnames from 'classnames/bind';
import styles from './Typeahead.module.scss';
classnames.bind(styles);

const TemplateTypeaheadItem = ({ id }) => (
  <div className={styles.Item}>{id}</div>
);

export default TemplateTypeaheadItem;
