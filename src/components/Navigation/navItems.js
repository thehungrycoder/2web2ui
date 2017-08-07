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
    label: 'Account',
    to: '/account',
    icon: 'Settings',
    children: [
      {
        label: 'Profile',
        to: '/account/profile'
      },
      {
        label: 'Webhooks',
        to: '/webhooks'
      }
    ]
  }
];
