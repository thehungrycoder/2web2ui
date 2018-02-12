import React from 'react';
import { UnstyledLink } from '@sparkpost/matchbox';
import styles from './OptionTile.module.scss';

const OptionTile = ({
  label,
  content,
  wrapper: WrapperComponent = UnstyledLink,
  ...rest
}) => (
  <WrapperComponent className={styles.OptionTile} {...rest}>
    <h6>{label}</h6>
    <p className={styles.Content}>{content}</p>
  </WrapperComponent>
);

export default OptionTile;
