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
    layout: App
    // do not put any condition here bc all other routes redirect here if their condition is false
  },
  {
    path: '/reports',
    redirect: '/reports/summary'
  },
  {
    path: '/reports/summary',
    component: reports.SummaryPage,
    layout: App
  },
  {
    path: '/reports/bounce',
    component: reports.BouncePage,
    layout: App
  },
  {
    path: '/reports/message-events',
    component: reports.MessageEventsPage,
    layout: App
  },
  {
    path: '/reports/message-events/:messageId',
    component: reports.EventPage,
    layout: App
  },
  {
    path: '/account/subaccounts',
    component: subaccounts.ListPage,
    condition: hasGrants('subaccount/manage'),
    layout: App
  },
  {
    path: '/account/subaccounts/create',
    component: subaccounts.CreatePage,
    condition: hasGrants('subaccount/manage'),
    layout: App
  },
  {
    path: '/account/subaccounts/:id',
    component: subaccounts.DetailsPage,
    condition: hasGrants('subaccount/manage'),
    layout: App,
    exact: false
  },
  {
    path: '/account/users',
    component: users.ListPage,
    condition: hasGrants('users/manage'),
    layout: App
  },
  {
    path: '/account/users/create',
    component: users.CreatePage,
    condition: hasGrants('users/manage'),
    layout: App
  },
  {
    path: '/templates',
    component: templates.ListPage,
    condition: composeConditions(hasGrants('templates/modify'), ({ account }) => account.status === 'active'),
    layout: App
  },
  {
    path: '/templates/create/:id?',
    component: templates.CreatePage,
    condition: hasGrants('templates/modify'),
    layout: App
  },
  {
    path: '/templates/edit/:id',
    component: templates.EditPage,
    condition: hasGrants('templates/modify'),
    layout: App
  },
  {
    path: '/templates/edit/:id/published',
    component: templates.PublishedPage,
    condition: hasGrants('templates/modify'),
    layout: App
  },
  {
    path: '/lists/recipient-lists',
    component: recipientLists.ListPage,
    condition: hasGrants('recipient_lists/manage'),
    layout: App
  },
  {
    path: '/webhooks',
    component: webhooks.ListPage,
    condition: hasGrants('webhooks/view'),
    layout: App
  },
  {
    path: '/webhooks/create',
    component: webhooks.CreatePage,
    condition: hasGrants('webhooks/modify'),
    layout: App
  },
  {
    path: '/webhooks/details/:id',
    component: webhooks.DetailsPage,
    condition: hasGrants('webhooks/modify'),
    layout: App,
    exact: false
  },
  {
    path: '/account/api-keys',
    component: apiKeys.ListPage,
    condition: hasGrants('api_keys/manage'),
    layout: App
  },
  {
    path: '/account/api-keys/create',
    component: apiKeys.CreatePage,
    condition: hasGrants('api_keys/manage'),
    layout: App
  },
  {
    path: '/account/api-keys/details/:id',
    component: apiKeys.DetailsPage,
    condition: hasGrants('api_keys/manage'),
    layout: App
  },
  {
    path: '/account/tracking-domains/',
    component: trackingDomains.ListPage,
    condition: hasGrants('tracking_domains/view'),
    layout: App
  },
  {
    path: '/account/tracking-domains/create',
    component: trackingDomains.CreatePage,
    condition: hasGrants('tracking_domains/manage'),
    layout: App
  },
  {
    path: '/account/profile',
    component: ProfilePage,
    condition: hasGrants('users/self-manage'),
    layout: App
  },
  {
    path: '/account/billing',
    component: billing.SummaryPage,
    condition: hasGrants('account/manage'),
    layout: App
  },
  {
    path: '/account/billing/plan',
    component: billing.ChangePlanPage,
    condition: hasGrants('account/manage'),
    layout: App
  },
  {
    path: '/account/ip-pools',
    component: ipPools.ListPage,
    condition: hasGrants('ip_pools/manage'),
    layout: App
  },
  {
    path: '/account/ip-pools/create',
    component: ipPools.CreatePage,
    condition: hasGrants('ip_pools/manage'),
    layout: App
  },
  {
    path: '/account/ip-pools/edit/:id',
    component: ipPools.EditPage,
    condition: hasGrants('ip_pools/manage'),
    layout: App
  }
];
