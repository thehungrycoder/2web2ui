import React, { Fragment } from 'react';
import { Page } from '@sparkpost/matchbox';
import { Signal } from '@sparkpost/matchbox-icons';

import styles from './SignalsPage.module.scss';

const SignalsPage = (props) => (
  <Page
    {...props}
    title={<Fragment><Signal size={45} className={styles.Icon}/> Signals</Fragment>}
  />
);

export default SignalsPage;
