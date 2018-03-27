export const RELATIVE_DATE_OPTIONS = [
  'hour',
  'day',
  '7days',
  '10days',
  'custom'
];

export const EVENT_FILTERS = [
  'delivery',
  'injection',
  'bounce',
  'delay',
  'policy_rejection',
  'out_of_band',
  'open',
  'initial_open',
  'click',
  'generation_failure',
  'generation_rejection',
  'spam_complaint',
  'list_unsubscribe',
  'link_unsubscribe'
];

export const TEXT_FILTERS = [
  { key: 'friendly_froms', label: 'From Addresses' },
  { key: 'subaccounts', label: 'Subaccount IDs' },
  { key: 'message_ids', label: 'Message IDs' },
  { key: 'template_ids', label: 'Template IDs' },
  { key: 'campaign_ids', label: 'Campaign IDs' }
];
