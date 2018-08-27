import React, { Fragment } from 'react';
import { TextField } from '@sparkpost/matchbox';
import { TEXT_FILTERS } from './searchConfig';
import styles from './AdvancedFilters.module.scss';

const TextFilters = ({ filterValues, onChange }) => <Fragment>
  <p><small>Each of these filters accept comma-separated values.</small></p>
  {TEXT_FILTERS.map(({ key, label }) => <div className={styles.FieldWrapper} key={key}>
    <TextField
      id={key}
      value={filterValues[key]}
      onChange={(e) => onChange(e, key)}
      label={label} />
  </div>)}
</Fragment>;

export default TextFilters;
