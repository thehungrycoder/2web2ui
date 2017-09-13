import React from 'react';

import { Toggle, Grid } from '@sparkpost/matchbox';
import styles from './ToggleBlock.module.scss';

const ToggleBlock = ({ input, meta, label, helpText, ...rest }) => {
  const helpMarkup = helpText
    ? <p className={styles.Help}>{ helpText }</p>
    : null;

  return (
    <div className={styles.ToggleBlock}>
      <Grid>
        <Grid.Column xs={8}>
          <label className={styles.Label}>{ label }</label>
        </Grid.Column>
        <Grid.Column xs={4}>
          <div className={styles.ToggleWrapper}>
            <Toggle id={input.name} {...input} {...rest} />
          </div>
        </Grid.Column>
      </Grid>
      { helpMarkup }
    </div>
  );
};

export default ToggleBlock;
