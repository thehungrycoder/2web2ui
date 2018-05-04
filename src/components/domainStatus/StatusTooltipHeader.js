import React from 'react';

import { Tooltip } from '@sparkpost/matchbox';
import { Help } from '@sparkpost/matchbox-icons';

const tooltipContent = 'Domains can be ready for sending (From), sending with DKIM signing, and bounce (Return Path) usage.';

const StatusTooltipHeader = () => <Tooltip dark content={tooltipContent}>Status <Help size={14}/></Tooltip>;

export default StatusTooltipHeader;
