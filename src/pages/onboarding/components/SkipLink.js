import React from 'react';
import { ArrowForward } from '@sparkpost/matchbox-icons';
import { PageLink } from 'src/components';

import styles from './SkipLink.module.scss';

const SkipLink = ({ to, children }) => (
  <PageLink to={to} className={styles.SkipLink}>
    {children} <ArrowForward />
  </PageLink>
);

export default SkipLink;
