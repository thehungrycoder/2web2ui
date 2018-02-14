import React from 'react';
import { Link } from 'react-router-dom';
import { UnstyledLink, Icon } from '@sparkpost/matchbox';

import styles from './SkipLink.module.scss';

const SkipLink = ({ to, children }) => (
  <UnstyledLink to={to} Component={Link} className={styles.SkipLink}>
    {children} <Icon name='ArrowRight'/>
  </UnstyledLink>
);

export default SkipLink;
