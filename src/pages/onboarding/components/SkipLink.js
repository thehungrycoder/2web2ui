import React from 'react';
import { Link } from 'react-router-dom';
import { UnstyledLink } from '@sparkpost/matchbox';
import { ArrowForward } from '@sparkpost/matchbox-icons';

import styles from './SkipLink.module.scss';

const SkipLink = ({ to, children }) => (
  <UnstyledLink to={to} Component={Link} className={styles.SkipLink}>
    {children} <ArrowForward />
  </UnstyledLink>
);

export default SkipLink;
