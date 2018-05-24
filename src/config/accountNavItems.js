import { OpenInNew, ExitToApp } from '@sparkpost/matchbox-icons';
import { LINKS } from 'src/constants';
import { isHeroku } from 'src/helpers/conditions/user';
import not from 'src/helpers/conditions/not';

export default [
  {
    label: 'Profile',
    to: '/account/profile',
    section: 1
  },
  {
    label: 'Billing',
    to: '/account/billing',
    section: 1
  },
  {
    label: 'Manage Users',
    to: '/account/users',
    section: 1
  },
  {
    label: 'API Documentation',
    external: true,
    to: LINKS.DOCS,
    icon: OpenInNew,
    section: 2,
    condition: not(isHeroku)
  },
  {
    label: 'Log Out',
    to: '/logout',
    icon: ExitToApp,
    section: 2,
    condition: not(isHeroku)
  }
];
