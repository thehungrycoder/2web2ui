import React, { Fragment } from 'react';
import { Page } from '@sparkpost/matchbox';
import { Signal } from '@sparkpost/matchbox-icons';

import styles from './SignalsPage.module.scss';

const Title = () => (
  <Fragment><Signal size={45} className={styles.Icon}/> Signals</Fragment>
);

const SignalsPage = (props) => (
  <Page {...props} title={<Title />} />
)

export default SignalsPage
