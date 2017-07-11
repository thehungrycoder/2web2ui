export default [
  {
    label: 'Dashboard',
    to: '/dashboard',
    icon: 'Home'
  },
  {
    label: 'Reports',
    to: '/reports', // This does nothing right now
    icon: 'InsertChart',
    children: [
      {
        label: 'Summary',
        to: '/reports/summary'
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
    label: 'Settings',
    to: '/settings',
    icon: 'Settings',
    children: [
      {
        label: 'Profile',
        to: '/settings/profile'
      },
      {
        label: 'Webhooks',
        to: '/settings/webhooks'
      }
    ]
  }
];
