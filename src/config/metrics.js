/* eslint-disable max-lines */
function average(item, keys = []) {
  return item[keys[0]] / item[keys[1]];
}

function rate(item, keys) {
  return (item[keys[0]] / item[keys[1]]) * 100;
}

export const list = [
  {
    key: 'count_targeted',
    label: 'Targeted',
    type: 'total',
    unit: 'number',
    description: 'Messages successfully injected into SparkPost as well as rejected by it.',
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
    key: 'count_accepted',
    label: 'Accepted',
    type: 'total',
    unit: 'number',
    description: 'Messages an ISP or other remote domain accepted (less Out-of-Band Bounces).',
    inSummary: true
  },
  {
    key: 'count_delivered_first',
    label: 'Delivered 1st Attempt',
    type: 'total',
    unit: 'number',
    description: 'Messages delivered on the first attempt.',
    inSummary: true
  },
  {
    key: 'count_delivered_subsequent',
    label: 'Delivered 2+ Attempts',
    type: 'total',
    unit: 'number',
    description: 'Messages delivered that required more than one delivery attempt.',
    inSummary: true
  },
  {
    key: 'count_spam_complaint',
    label: 'Spam Complaints',
    type: 'total',
    unit: 'number',
    description: 'Number of spam complaints received from an ISP',
    notApplicableFor: ['nodes'],
    inSummary: true
  },
  {
    key: 'spam_complaint_rate',
    label: 'Spam Complaint Rate',
    unit: 'percent',
    computeKeys: ['count_spam_complaint', 'count_delivered'],
    compute: rate,
    description: 'Percentage of Delivered messages that resulted in spam complaints.',
    inSummary: true
  },
  {
    key: 'count_rendered',
    label: 'Rendered',
    type: 'total',
    unit: 'number',
    description: 'Total renderings of a message.',
    inSummary: true
  },
  {
    key: 'count_unique_rendered_approx',
    label: 'Unique Rendered',
    type: 'total',
    unit: 'number',
    description: 'Total number of messages that were rendered at least once.',
    inSummary: true
  },
  {
    key: 'count_initial_rendered',
    label: 'Initial Rendered',
    type: 'total',
    unit: 'number',
    description: 'Total initial renderings of a message.',
    inSummary: true
  },
  {
    key: 'count_unique_initial_rendered_approx',
    label: 'Initial Unique Rendered',
    type: 'total',
    unit: 'number',
    description: 'Total number of messages that were intially rendered at least once.',
    inSummary: true
  },
  {
    key: 'count_unique_confirmed_opened_approx',
    label: 'Unique Confirmed Opens',
    type: 'total',
    unit: 'number',
    description: 'Total number of messages that were either rendered or had at least one link selected.',
    inSummary: true
  },
  {
    key: 'count_clicked',
    label: 'Clicks',
    type: 'total',
    unit: 'number',
    description: 'Total number of times that links were selected across all messages.',
    inSummary: true
  },
  {
    key: 'count_unique_clicked_approx',
    label: 'Unique Clicks',
    type: 'total',
    unit: 'number',
    description: 'Total number of messages which had at least one link selected one or more times. ',
    inSummary: true
  },
  {
    key: 'count_bounce',
    label: 'Bounced',
    type: 'total',
    unit: 'number',
    description: 'Total number of bounced messages, which includes both In-Band and Out-of-Band bounces.',
    inSummary: true
  },
  {
    key: 'count_hard_bounce',
    label: 'Hard Bounced',
    type: 'total',
    unit: 'number',
    description: 'Total number of Bounced messages due to hard bounce classification reasons.',
    inSummary: true
  },
  {
    key: 'count_soft_bounce',
    label: 'Soft Bounced',
    type: 'total',
    unit: 'number',
    description: 'Total number of Bounced messages due to soft bounce classification reasons.',
    inSummary: true
  },
  {
    key: 'count_block_bounce',
    label: 'Block Bounced',
    type: 'total',
    unit: 'number',
    description: 'Total number of Bounced messages due to an IP block.',
    inSummary: true
  },
  {
    key: 'count_admin_bounce',
    label: 'Admin Bounced',
    type: 'total',
    unit: 'number',
    description: 'Total number of Bounced messages due to admin bounce classification reasons, also includes Rejected.',
    inSummary: true
  },
  {
    key: 'count_undetermined_bounce',
    label: 'Undetermined Bounced',
    type: 'total',
    unit: 'number',
    description: 'Total number of Bounced messages due to undetermined bounce reasons.',
    inSummary: true
  },
  {
    key: 'count_rejected',
    label: 'Rejected',
    type: 'total',
    unit: 'number',
    description: 'Messages either rejected due to policy or failed to generate.',
    inSummary: true
  },
  {
    key: 'count_policy_rejection',
    label: 'Policy Rejection',
    type: 'total',
    unit: 'number',
    description: 'Messages rejected by SparkPost due to policy.',
    inSummary: true
  },
  {
    key: 'count_generation_failed',
    label: 'Generation Failure',
    type: 'total',
    unit: 'number',
    description: 'Message generation failed for an intended recipient.',
    inSummary: true
  },
  {
    key: 'count_generation_rejection',
    label: 'Generation Rejection',
    type: 'total',
    unit: 'number',
    description: 'Messages rejected by SparkPost due to policy.',
    inSummary: true
  },
  {
    key: 'accepted_rate',
    label: 'Accepted Rate',
    unit: 'percent',
    computeKeys: ['count_accepted', 'count_targeted'],
    compute: rate,
    description: 'Percentage of Targeted messages that were accepted.',
    inSummary: true
  },
  {
    key: 'open_rate_approx',
    label: 'Open Rate',
    type: 'percentage',
    unit: 'percent',
    computeKeys: ['count_unique_confirmed_opened_approx', 'count_targeted'],
    compute: rate,
    description: 'Percentage of Targeted messages that were either rendered or had at least one link selected.',
    inSummary: true
  },
  {
    key: 'click_through_rate_approx',
    label: 'Click-through Rate',
    unit: 'percent',
    computeKeys: ['count_unique_clicked_approx', 'count_targeted'],
    compute: rate,
    description: 'Percentage of Targeted messages that had at least one link selected.',
    inSummary: true
  },
  {
    key: 'bounce_rate',
    label: 'All Bounce Rate',
    type: 'percentage',
    unit: 'percent',
    computeKeys: ['count_bounce', 'count_targeted'],
    compute: rate,
    description: 'Percentage of Targeted messages that Bounced.',
    inSummary: true
  },
  {
    key: 'hard_bounce_rate',
    label: 'Hard Bounce Rate',
    unit: 'percent',
    computeKeys: ['count_hard_bounce', 'count_targeted'],
    compute: rate,
    description: 'Percentage of Targeted messages that Hard Bounced.',
    inSummary: true
  },
  {
    key: 'soft_bounce_rate',
    label: 'Soft Bounce Rate',
    unit: 'percent',
    computeKeys: ['count_soft_bounce', 'count_targeted'],
    compute: rate,
    description: 'Percentage of Targeted messages that Soft Bounced.',
    inSummary: true
  },
  {
    key: 'block_bounce_rate',
    label: 'Block Bounce Rate',
    type: 'percentage',
    unit: 'percent',
    computeKeys: ['count_block_bounce', 'count_targeted'],
    compute: rate,
    description: 'Percentage of Targeted messages that Block Bounced.',
    inSummary: true
  },
  {
    key: 'admin_bounce_rate',
    label: 'Admin Bounce Rate',
    unit: 'percent',
    computeKeys: ['count_admin_bounce', 'count_targeted'],
    compute: rate,
    description: 'Percentage of Targeted messages that Admin Bounced.',
    inSummary: true
  },
  {
    key: 'undetermined_bounce_rate',
    label: 'Undetermined Bounce Rate',
    unit: 'percent',
    computeKeys: ['count_undetermined_bounce', 'count_targeted'],
    compute: rate,
    description: 'Percentage of Targeted messages that Undetermined Bounced.',
    inSummary: true
  },
  {
    key: 'count_delayed',
    label: 'Delayed',
    type: 'total',
    unit: 'number',
    description: 'Total number of delays due to any temporary failure.',
    inSummary: true
  },
  {
    key: 'count_delayed_first',
    label: 'Delayed 1st Attempt',
    type: 'total',
    unit: 'number',
    description: 'Messages delayed on the first delivery attempt.',
    inSummary: true
  },
  {
    key: 'avg_delivery_time_first',
    label: 'Avg Latency 1st Attempt',
    unit: 'milliseconds',
    computeKeys: ['total_delivery_time_first', 'count_delivered_first'],
    compute: average,
    description: 'Average delivery time (latency) for messages delivered on the first attempt.',
    inSummary: true
  },
  {
    key: 'avg_delivery_time_subsequent',
    label: 'Avg Latency 2+ Attempts',
    unit: 'milliseconds',
    computeKeys: ['total_delivery_time_subsequent', 'count_delivered_subsequent'],
    compute: average,
    description: 'Average delivery time (latency) for messages delivered that required more than one attempt.',
    inSummary: true
  },
  {
    key: 'avg_msg_size',
    label: 'Avg Delivery Message Size',
    unit: 'bytes',
    computeKeys: ['total_msg_volume', 'count_delivered'],
    compute: average,
    description: 'Average size of delivered messages (including attachments).',
    inSummary: true
  },
  {
    key: 'total_msg_volume',
    label: 'Delivery Message Volume',
    type: 'total',
    unit: 'bytes',
    description: 'Total size of delivered messages (including attachments).',
    inSummary: true
  },
  /* below are metrics that never show in the summary report, but are needed when making API calls from the Metrics service */
  {
    key: 'count_inband_bounce',
    type: 'total',
    unit: 'number'
  },
  {
    key: 'count_outofband_bounce',
    type: 'total',
    unit: 'number'
  },
  {
    key: 'count_raw_clicked_approx',
    type: 'total',
    unit: 'number',
    description: 'Total number of messages which had at least one link selected one or more times.'
  }
];

export const map = list.reduce((accumulator = {}, metric) => ({ ...accumulator, [metric.key]: metric }));
