export const list = [
  {
    key: 'count_accepted',
    label: 'Accepted',
    type: 'total',
    unit: 'number',
    description: 'Messages an ISP or other remote domain accepted (less Out-of-Band Bounces).',
    inSummary: true
  },
  {
    key: 'count_injected',
    label: 'Injected',
    type: 'total',
    unit: 'number',
    description: 'Messages either injected to or received by SparkPost.',
    inSummary: true
  },
  {
    key: 'count_sent',
    label: 'Sent',
    type: 'total',
    unit: 'number',
    description: 'Messages that SparkPost attempted to deliver, which includes both Deliveries and In-Band Bounces.',
    inSummary: true
  },
  {
    key: 'count_targeted',
    label: 'Targeted',
    type: 'total',
    unit: 'number',
    description: 'Messages successfully injected into SparkPost as well as rejected by it.',
    inSummary: true
  }
];
