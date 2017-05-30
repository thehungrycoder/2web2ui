export default [
  {
    label: 'Dashboard',
    to: '/dashboard',
    icon: 'test'
  },
  {
    label: 'Reports',
    to: '/reports',
    icon: 'test',
    children: [
      {
        label: 'Summary',
        to: '/reports/summary'
      }
    ]
  },
  {
    label: 'Account',
    to: '/reports',
    icon: 'test'
  }
];
