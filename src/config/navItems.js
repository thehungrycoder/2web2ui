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
      }
    ]
  },
  {
    label: 'Templates',
    to: '/templates',
    icon: 'Code'
  },
  {
    label: 'Recipients',
    to: '/recipient-lists',
    icon: 'Mail'
  },
  {
    label: 'Suppressions',
    to: '/suppression-lists',
    icon: 'Block'
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
      }
    ]
  }
];
