import React from 'react';

import { Tooltip, Icon } from '@sparkpost/matchbox';

import styles from './StatusTooltip.module.scss';

const tooltipContent = 'Domains can be ready for sending (From), sending with DKIM signing, and bounce (Return Path) usage.';

const StatusTooltip = ({ children }) => <Tooltip dark content={tooltipContent}>{children} <Icon name='Help' size={15} className={styles.StatusTooltip}/></Tooltip>;

export default StatusTooltip;
