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
        to: '/lits/suppression-list'
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
