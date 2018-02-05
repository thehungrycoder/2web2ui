import React from 'react';

import { Tooltip, Icon } from '@sparkpost/matchbox';

const tooltipContent = 'Domains can be ready for sending (From), sending with DKIM signing, and bounce (Return Path) usage.';

const StatusTooltip = ({ children }) => <Tooltip dark content={tooltipContent}>{children} <Icon name='Help' size={14}/></Tooltip>;

export default StatusTooltip;
