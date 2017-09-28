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
    component: DashboardPage
  },
  {
    path: '/reports',
    redirect: '/reports/summary'
  },
  {
    path: '/reports/summary',
    component: reports.SummaryPage,
    condition: composeConditions(
      hasGrants('metrics/view'),
      configFlag('summaryChart.enabled')
    )
  },
  {
    path: '/templates',
    component: templates.ListPage
  },
  {
    path: '/templates/create',
    component: templates.CreatePage
  },
  {
    path: '/templates/edit/:id',
    component: templates.EditPage
  },
  {
    path: '/templates/edit/:id/published',
    component: templates.PublishedPage
  },
  {
    path: '/webhooks',
    component: webhooks.ListPage
  },
  {
    path: '/webhooks/create',
    component: webhooks.CreatePage
  },
  {
    path: '/webhooks/details/:id',
    component: webhooks.DetailsPage
  },
  {
    path: '/account/credentials',
    component: credentials.ListPage
  },
  {
    path: '/account/profile',
    component: ProfilePage
  },
  {
    path: '/account/billing',
    component: billing.OverviewPage
  },
  {
    path: '/account/billing/change',
    component: billing.ChangePlanPage
  }
];
