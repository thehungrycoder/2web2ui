export default [
  {
    label: 'Dashboard',
    to: '/dashboard',
    icon: 'Home'
  },
  {
    label: 'Reports',
    to: '/reports',
    icon: 'ReportBox',
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
    icon: 'Code'
  },
  {
    label: 'Lists',
    to: '/lists',
    icon: 'Mail',
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
    icon: 'Language'
  },
  {
    label: 'Account',
    to: '/account',
    icon: 'Settings',
    children: [
      {
        label: 'Billing',
        to: '/account/billing'
      },
      {
        label: 'API Keys',
        to: '/account/api-keys'
      },
      {
        label: 'Profile',
        to: '/account/profile'
      },
      {
        label: 'Security',
        to: '/account/security'
      },
      {
        label: 'Sending domains',
        to: '/account/sending-domains'
      },
      {
        label: 'SMTP Relay',
        to: '/account/smtp'
      },
      {
        label: 'Subaccounts',
        to: '/account/subaccounts'
      },
      {
        label: 'Users',
        to: '/account/users'
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
