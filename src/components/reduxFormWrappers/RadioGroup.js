import React from 'react';
import { Grid, Radio, Label, Error } from '@sparkpost/matchbox';
import styles from './RadioGroup.module.scss';

export default function RadioGroup({
  label, input, options, title, meta, grid = { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}) {
  const { error, touched } = meta;

  return (
    <Radio.Group label={label}>
      <Label>{title}{touched && error ? <Error error={error}/> : ''}</Label>
      <Grid>
        {options.map((o) => (
          <Grid.Column {...grid} key={`${input.name}-${o.value}`}>
            <div className={styles.RadioWrapper}>
              <Radio
                {...input}
                id={`${input.name}-${o.value}`}
                label={o.label}
                checked={o.value === input.value}
                disabled={!!o.disabled}
                value={o.value}
                helpText={o.helpText}
              />
            </div>
          </Grid.Column>
        ))}
      </Grid>
    </Radio.Group>
  );
}
