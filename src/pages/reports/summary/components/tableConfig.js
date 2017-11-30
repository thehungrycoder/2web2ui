export const GROUP_OPTIONS = [
  {
    value: 'domain',
    label: 'Recipient Domain'
  },
  {
    value: 'campaign',
    label: 'Campaign'
  },
  {
    value: 'template',
    label: 'Template'
  },
  {
    value: 'subaccount',
    label: 'Subaccount'
  },
  {
    value: 'sending-domain',
    label: 'From Domain'
  },
  {
    value: 'sending-ip',
    label: 'Sending IP'
  },
  {
    value: 'ip-pool',
    label: 'Pool Name'
  }
];

export const GROUP_COL_CONFIG = {
  domain: {
    columnLabel: 'Domain',
    key: 'domain'
  },
  campaign: {
    columnLabel: 'Campaign ID',
    key: 'campaign_id'
  },
  template: {
    columnLabel: 'Template ID',
    key: 'template_id'
  },
  subaccount: {
    columnLabel: 'Subaccount ID',
    key: 'subaccount_id'
  },
  'sending-domain': {
    columnLabel: 'Domain',
    key: 'sending_domain'
  },
  'sending-ip': {
    columnLabel: 'IP Name',
    key: 'sending_ip'
  },
  'ip-pool': {
    columnLabel: 'Pool Name',
    key: 'ip_pool'
  }
};
