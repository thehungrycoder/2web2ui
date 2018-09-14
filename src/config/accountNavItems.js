import { OpenInNew, ExitToApp } from '@sparkpost/matchbox-icons';
import { LINKS } from 'src/constants';
import { openSupportPanel } from 'src/actions/support';
import { isHeroku } from 'src/helpers/conditions/user';
import not from 'src/helpers/conditions/not';

/***
 * These values are pulled in through the accountNavItems selector, which will map
 * each "to" value here to a corresponding route in "config/routes.js", if
 * one exists. This way, visibility of a navigation item will depend on the
 * corresponding route's "condition" function, so a user who doesn't have access
 * to /some/route will not see the nav item that points to /some/route
 *
 * Additionally, nav items can have their own conditions which also must be true
 * for the nav item to appear in the list. This is useful for nav items that
 * link to external URLs (e.g. docs) and for items that we may want to hide from
 * the nav without blocking access to the route wholesale (e.g. logout)
 *
 * Only "label" and "to" are required keys
 *
 * The "section" key here splits the final navigation into ordered groups
 * separated by a horizontal line separator
 *
 * The "icon" key here will right-align an icon when the item is displayed
 */

export default [
  {
    label: 'Account Settings',
    to: '/account/settings',
    section: 1
  },
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
    label: 'Get Help',
    section: 2,
    action: openSupportPanel
  },
  {
    label: 'API Docs',
    external: true,
    to: LINKS.API_DOCS,
    icon: OpenInNew,
    section: 2,
    condition: not(isHeroku)
  },
  {
    label: 'Log Out',
    to: '/logout',
    icon: ExitToApp,
    section: 3,
    condition: not(isHeroku)
  }
];
