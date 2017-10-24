/* eslint-disable */
import {
  apiKeys,
  AuthPage,
  billing,
  DashboardPage,
  ProfilePage,
  reports,
  recipientLists,
  subaccounts,
  templates,
  trackingDomains,
  users,
  webhooks,
  ipPools
} from 'src/pages';

import {
  hasGrants,
  configFlag,
  composeConditions
} from 'src/helpers/conditions';

import App from 'src/components/layout/App';
import Form from 'src/components/layout/Form';

import CollectionDemo from './CollectionDemo';

/**
 *  Angular UI Grant List:
    dashboard: ['api_keys/manage', 'templates/modify', 'sending_domains/manage'],
    credentials: ['api_keys/manage'],
    billing: ['account/manage'],
    domains: ['sending_domains/manage'], // make domains
    profile: ['users/self-manage'],
    security: ['users/self-manage'],
    sendingDomains: ['sending_domains/manage'],
    subaccounts: ['subaccount/manage', 'api_keys/manage', 'sending_domains/manage'],
    smtp: ['api_keys/manage'],
    trackingDomains: ['tracking_domains/view'],
    usage: ['account/manage'],
    users: ['users/manage'],
    webhooks: ['webhooks/view'],
    templates: ['templates/modify'],
    templatesView: ['templates/view'],
    transmit: ['transmissions/modify'],
    recipientLists: ['recipient_lists/manage'],
    suppressions: ['suppression_lists/manage'],
    ipPools: ['ip_pools/manage']
 */

 /**
  * Reporting user grants:
  * metrics/view
  * message_events/view
  * templates/view
  * templates/preview
  * sending_domains/view
  * adaptive-delivery/view
  * users/self-manage
  * grants/view
  * subaccount/view
  * messaging-tools/manage
  * support/manage
  */

export default [
  {
    path: '/',
    public: true,
    redirect: '/auth'
  },
  {
    path: '/auth',
    public: true,
    component: AuthPage
  },
  {
    path: '/collection-demo',
    component: CollectionDemo
  },
  {
    path: '/dashboard',
    component: DashboardPage
    // do not put any condition here bc all other routes redirect here if their condition is false
  },
  {
    path: '/reports',
    redirect: '/reports/summary'
  },
  {
    path: '/reports/summary',
    component: reports.SummaryPage
  },
  {
    path: '/account/subaccounts',
    component: subaccounts.ListPage,
    condition: hasGrants('subaccount/manage')
  },
  {
    path: '/account/users',
    component: users.ListPage,
    condition: hasGrants('users/manage')
  },
  {
    path: '/account/users/create',
    component: users.CreatePage,
    condition: hasGrants('users/manage')
  },
  {
    path: '/templates',
    component: templates.ListPage,
    condition: composeConditions(hasGrants('templates/modify'), ({ account }) => account.status === 'active')
  },
  {
    path: '/templates/create',
    component: templates.CreatePage,
    condition: hasGrants('templates/modify')
  },
  {
    path: '/templates/edit/:id',
    component: templates.EditPage,
    condition: hasGrants('templates/modify')
  },
  {
    path: '/templates/edit/:id/published',
    component: templates.PublishedPage,
    condition: hasGrants('templates/modify')
  },
  {
    path: '/lists/recipient-lists',
    component: recipientLists.ListPage,
    condition: hasGrants('recipient_lists/manage')
  },
  {
    path: '/webhooks',
    component: webhooks.ListPage,
    condition: hasGrants('webhooks/view')
  },
  {
    path: '/webhooks/create',
    component: webhooks.CreatePage,
    condition: hasGrants('webhooks/modify')
  },
  {
    path: '/webhooks/details/:id',
    component: webhooks.DetailsPage,
    condition: hasGrants('webhooks/modify')
  },
  {
    path: '/account/api-keys',
    component: apiKeys.ListPage,
    condition: hasGrants('api_keys/manage')
  },
  {
    path: '/account/api-keys/create',
    component: apiKeys.CreatePage,
    condition: hasGrants('api_keys/manage')
  },
  {
    path: '/account/api-keys/details/:id',
    component: apiKeys.DetailsPage,
    condition: hasGrants('api_keys/manage')
  },
  {
    path: '/account/tracking-domains/',
    component: trackingDomains.ListPage,
    condition: hasGrants('tracking_domains/view')
  },
  {
    path: '/account/profile',
    component: ProfilePage,
    condition: hasGrants('users/self-manage')
  },
  {
    path: '/account/billing',
    component: billing.SummaryPage,
    condition: hasGrants('account/manage')
  },
  {
    path: '/account/billing/plan',
    component: billing.ChangePlanPage,
    condition: hasGrants('account/manage')
  },
  {
    path: '/account/ip-pools',
    component: ipPools.ListPage,
    condition: hasGrants('ip_pools/manage')
  }
];
