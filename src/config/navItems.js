import { Home, InsertChart, Code, MailOutline, Language, Settings, Compare } from '@sparkpost/matchbox-icons';

export default [
  {
    label: 'Dashboard',
    to: '/dashboard',
    icon: Home
  },
  {
    label: 'Reports',
    to: '/reports',
    icon: InsertChart,
    children: [
      {
        label: 'Summary',
        to: '/reports/summary'
      },
      {
        label: 'Bounce',
        to: '/reports/bounce'
      },
      {
        label: 'Rejections',
        to: '/reports/rejections'
      },
      {
        label: 'Accepted',
        to: '/reports/accepted'
      },
      {
        label: 'Delayed',
        to: '/reports/delayed'
      },
      {
        label: 'Engagement',
        to: '/reports/engagement'
      },
      {
        label: 'Message Events',
        to: '/reports/message-events'
      }
    ]
  },
  {
    label: 'Templates',
    to: '/templates',
    icon: Code
  },
  {
    label: 'A/B Testing',
    to: '/ab-testing',
    icon: Compare
  },
  {
    label: 'Lists',
    to: '/lists',
    icon: MailOutline,
    children: [
      {
        label: 'Recipient Lists',
        to: '/lists/recipient-lists'
      },
      {
        label: 'Suppressions',
        to: '/lists/suppressions'
      }
    ]
  },
  {
    label: 'Webhooks',
    to: '/webhooks',
    icon: Language
  },
  {
    label: 'Settings',
    to: '/account',
    icon: Settings,
    children: [
      {
        label: 'API Keys',
        to: '/account/api-keys'
      },
      {
        label: 'Subaccounts',
        to: '/account/subaccounts'
      },
      {
        label: 'SMTP Settings',
        to: '/account/smtp'
      },
      {
        label: 'Sending Domains',
        to: '/account/sending-domains'
      },

      {
        label: 'Tracking Domains',
        to: '/account/tracking-domains'
      },
      {
        label: 'IP Pools',
        to: '/account/ip-pools'
      }
    ]
  }
];
