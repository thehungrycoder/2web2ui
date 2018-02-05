import React from 'react';
import { Icon } from '@sparkpost/matchbox';

import styles from './ReadyForIcon.module.scss';

const ReadyForIcon = ({ readyFor }) => readyFor.dkim
  ? <Icon name="Check" className={styles.GreenCheck}/>
  : <Icon name="Error" className={styles.RedError}/>;

export default ReadyForIcon;
