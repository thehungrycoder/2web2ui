import React from 'react';
import SparkPost from './SparkPost';
import { UnstyledLink } from '@sparkpost/matchbox';
import { LINKS } from 'src/constants';
import styles from './CenteredLogo.module.scss';

const CenteredLogo = () => (
  <div className={styles.CenteredLogo}>
    <UnstyledLink to={LINKS.SP_HOME_PAGE} title="SparkPost">
      <SparkPost.Logo />
    </UnstyledLink>
  </div>
);

export default CenteredLogo;
