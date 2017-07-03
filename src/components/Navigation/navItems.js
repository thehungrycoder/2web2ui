export default [
  {
    label: 'Dashboard',
    to: '/dashboard',
    icon: '🏠'
  },
  {
    label: 'Reports',
    to: '/reports', // This does nothing right now
    icon: '📈',
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
    label: 'Settings',
    to: '/settings',
    icon: '🛠',
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
