/* eslint-disable */
import {
  AuthPage,
  billing,
  DashboardPage,
  ProfilePage,
  credentials,
  reports,
  templates,
  webhooks
} from 'src/pages';

import {
  hasGrants,
  configFlag,
  composeConditions
} from 'src/helpers/conditions';

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
    path: '/dashboard',
    component: DashboardPage,
    condition: () => true // do not put any condition here bc all other routes redirect here if condition is false
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
    path: '/templates',
    component: templates.ListPage,
    condition: hasGrants('templates/modify')
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
    path: '/account/credentials',
    component: credentials.ListPage,
    condition: hasGrants('api_keys/manage')
  },
  {
    path: '/account/profile',
    component: ProfilePage,
    condition: hasGrants('users/self-manage')
  },
  {
    path: '/account/billing',
    component: billing.OverviewPage,
    condition: hasGrants('account/manage')
  },
  {
    path: '/account/billing/change',
    component: billing.ChangePlanPage,
    condition: hasGrants('account/manage')
  }
];
