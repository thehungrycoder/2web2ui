import React from 'react';
import { Icon } from '@sparkpost/matchbox';

import styles from './Icons.module.scss';

const VerifiedIcon = () => <Icon name="Check" size={16} className={styles.GreenCheck}/>;
VerifiedIcon.displayName = 'VerifiedIcon';

const ErrorIcon = () => <Icon name="Error" size={16} className={styles.RedError}/>;
ErrorIcon.displayName = 'ErrorIcon';


export {
  VerifiedIcon,
  ErrorIcon
};
