/* eslint-disable max-lines */
import {
  apiKeys,
  AuthPage,
  SSOPage,
  billing,
  DashboardPage,
  sendingDomains,
  RegisterPage,
  reports,
  recipientLists,
  SmtpPage,
  suppressions,
  subaccounts,
  templates,
  trackingDomains,
  users,
  webhooks,
  ipPools,
  PageNotFound,
  DefaultRedirect,
  JoinPage,
  passwordReset,
  PremiumSupportPage
} from 'src/pages';

import onboarding from 'src/pages/onboarding';
import { default as emailVerification } from 'src/components/emailVerification/EmailVerification';
import { emailVerificationRedirect, emailRedirects } from './emailRoutes';
import SecretBillingPlanOrBillingSummaryPage from './SecretBillingPlanOrBillingSummaryPage';

import { hasGrants, all, not } from 'src/helpers/conditions';
import { isEnterprise, isAws } from 'src/helpers/conditions/account';
import { isHeroku, isAzure } from 'src/helpers/conditions/user';
import { configFlag, configEquals } from 'src/helpers/conditions/config';


import App from 'src/components/layout/App';

import { DEFAULT_REDIRECT_ROUTE } from 'src/constants';

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

const routes = [
  {
    path: '/',
    public: true,
    redirect: '/auth'
  },
  {
    path: '/auth',
    public: true,
    component: AuthPage,
    title: 'Log In'
  },
  {
    path: '/sso',
    public: true,
    component: SSOPage,
    title: 'Single Sign-On'
  },
  {
    path: '/register',
    public: true,
    forceLogout: true,
    component: RegisterPage,
    title: 'Finish Your Registration'
  },
  {
    path: '/sign-up',
    public: true,
    redirect: '/join'
  },
  {
    path: '/join',
    public: true,
    forceLogout: true,
    component: JoinPage,
    condition: configFlag('featureFlags.has_signup'),
    title: 'Join'
  },
  {
    path: '/forgot-password',
    public: true,
    forceLogout: true,
    component: passwordReset.ForgotPasswordPage,
    title: 'Reset Password'
  },
  {
    path: '/reset-password/:token',
    public: true,
    forceLogout: true,
    component: passwordReset.ResetPasswordPage,
    title: 'Choose a New Password'
  },

  /**
   * This "DefaultRedirect" route is where we send _everyone_ once they first
   * log in, through Auth or Register or SSO or anything else. It will display
   * a loading icon until the access control state is loaded, then make a decision
   * on where to send them based on config, role, etc.
   *
   * TODO: Once the Dashboard is universally accessible, this can probably go away
   */
  {
    path: DEFAULT_REDIRECT_ROUTE,
    component: DefaultRedirect,
    layout: App,
    condition: () => true, // this route MUST be accessible to all logged-in app users
    title: 'Loading...'
  },

  /**
   * Handles route redirects for cutover to GA from old email template links
   * TODO: Should remove at a later date
   */
  ...emailRedirects,

  {
    path: '/dashboard',
    component: DashboardPage,
    layout: App,
    title: 'Dashboard',
    condition: all(
      hasGrants('api_keys/manage', 'templates/modify', 'sending_domains/manage'),
      configEquals('splashPage', '/dashboard') // want to hide if not a splash page https://jira.int.messagesystems.com/browse/FAD-6046
    )
    // TODO: implement some kind of blockedRoutes check that runs on every route so we can
    // hide routes based on config, account/user settings, etc. without having to mess
    // around with grants in the web UI keys
  },
  {
    path: '/reports',
    redirect: '/reports/summary'
  },
  {
    path: '/reports/summary',
    component: reports.SummaryPage,
    layout: App,
    title: 'Summary Report'
  },
  {
    path: '/reports/bounce',
    component: reports.BouncePage,
    layout: App,
    title: 'Bounce Report'
  },
  {
    path: '/reports/rejections',
    component: reports.RejectionPage,
    layout: App,
    title: 'Rejection Report'
  },
  {
    path: '/reports/accepted',
    component: reports.AcceptedPage,
    layout: App,
    title: 'Accepted Report'
  },
  {
    path: '/reports/delayed',
    component: reports.DelayPage,
    layout: App,
    title: 'Delayed Report'
  },
  {
    path: '/reports/engagement',
    component: reports.EngagementPage,
    layout: App,
    title: 'Engagement Report'
  },
  {
    path: '/reports/message-events',
    component: reports.MessageEventsPage,
    layout: App,
    title: 'Message Events Report'
  },
  {
    path: '/reports/message-events/details/:messageId',
    component: reports.EventPage,
    layout: App,
    title: 'Message History'
  },
  {
    path: '/account/security',
    redirect: '/account/profile'
  },
  {
    path: '/account/email-verification/:token',
    component: emailVerification,
    title: 'Verify Your Email'
  },
  {
    path: '/account/subaccounts',
    component: subaccounts.ListPage,
    condition: hasGrants('subaccount/manage', 'api_keys/manage', 'sending_domains/manage'),
    layout: App,
    title: 'Subaccounts'
  },
  {
    path: '/account/subaccounts/create',
    component: subaccounts.CreatePage,
    condition: hasGrants('subaccount/manage', 'api_keys/manage', 'sending_domains/manage'),
    layout: App,
    title: 'New Subaccount'
  },
  {
    path: '/account/subaccounts/:id',
    component: subaccounts.DetailsPage,
    condition: hasGrants('subaccount/manage', 'api_keys/manage', 'sending_domains/manage'),
    layout: App,
    title: 'Subaccount Details',
    exact: false
  },
  {
    path: '/account/users',
    component: users.ListPage,
    condition: hasGrants('users/manage'),
    layout: App,
    title: 'Users'
  },
  {
    path: '/account/users/create',
    component: users.CreatePage,
    condition: hasGrants('users/manage'),
    layout: App,
    title: 'Invite User'
  },
  {
    path: '/templates',
    component: templates.ListPage,
    condition: hasGrants('templates/view'),
    layout: App,
    title: 'Templates'
  },
  {
    path: '/templates/create/:id?',
    component: templates.CreatePage,
    condition: hasGrants('templates/modify'),
    layout: App,
    title: 'New Template'
  },
  {
    path: '/templates/edit/:id',
    component: templates.EditPage,
    condition: hasGrants('templates/view'),
    layout: App,
    title: 'Edit Template'
  },
  {
    path: '/templates/edit/:id/published',
    component: templates.PublishedPage,
    condition: hasGrants('templates/view'),
    layout: App,
    title: 'View Published Template'
  },
  {
    path: '/templates/preview/:id',
    component: templates.PreviewDraftPage,
    condition: hasGrants('templates/view'),
    layout: App,
    title: 'Preview Draft Template'
  },
  {
    path: '/templates/preview/:id/published',
    component: templates.PreviewPublishedPage,
    condition: hasGrants('templates/view'),
    layout: App,
    title: 'Preview Published Template'
  },
  {
    path: '/lists/recipient-lists',
    component: recipientLists.ListPage,
    condition: hasGrants('recipient_lists/manage'),
    layout: App,
    title: 'Recipient Lists'
  },
  {
    path: '/lists/recipient-lists/create',
    component: recipientLists.CreatePage,
    condition: hasGrants('recipient_lists/manage'),
    layout: App,
    title: 'New Recipient List'
  },
  {
    path: '/lists/recipient-lists/edit/:id',
    component: recipientLists.EditPage,
    condition: hasGrants('recipient_lists/manage'),
    layout: App,
    title: 'Edit Recipient List'
  },
  {
    path: '/lists/suppressions',
    component: suppressions.ListPage,
    condition: hasGrants('suppression_lists/manage'),
    layout: App,
    title: 'Suppression List'
  },
  {
    path: '/lists/suppressions/create',
    component: suppressions.CreatePage,
    condition: hasGrants('suppression_lists/manage'),
    layout: App,
    title: 'New Suppression'
  },
  {
    path: '/webhooks',
    component: webhooks.ListPage,
    condition: hasGrants('webhooks/view'),
    layout: App,
    title: 'Webhooks'
  },
  {
    path: '/webhooks/create',
    component: webhooks.CreatePage,
    condition: hasGrants('webhooks/modify'),
    layout: App,
    title: 'New Webhook'
  },
  {
    path: '/webhooks/details/:id',
    component: webhooks.DetailsPage,
    condition: hasGrants('webhooks/modify'),
    layout: App,
    title: 'Webhook Details',
    exact: false
  },
  {
    path: '/account/api-keys',
    component: apiKeys.ListPage,
    condition: hasGrants('api_keys/manage'),
    layout: App,
    title: 'API Keys'
  },
  {
    path: '/account/api-keys/create',
    component: apiKeys.CreatePage,
    condition: hasGrants('api_keys/manage'),
    layout: App,
    title: 'New API Key'
  },
  {
    path: '/account/api-keys/edit/:id',
    component: apiKeys.EditPage,
    condition: hasGrants('api_keys/manage'),
    layout: App,
    title: 'Edit API Key'
  },
  {
    path: '/account/api-keys/view/:id',
    component: apiKeys.DetailsPage,
    condition: hasGrants('api_keys/manage'),
    layout: App,
    title: 'View API Key'
  },
  {
    path: '/account/tracking-domains',
    component: trackingDomains.ListPage,
    condition: hasGrants('tracking_domains/view'),
    layout: App,
    title: 'Tracking Domains'
  },
  {
    path: '/account/tracking-domains/create',
    component: trackingDomains.CreatePage,
    condition: hasGrants('tracking_domains/manage'),
    layout: App,
    title: 'New Tracking Domain'
  },
  {
    path: '/account/profile',
    component: emailVerificationRedirect,
    condition: hasGrants('users/self-manage'),
    layout: App,
    title: 'My Profile'
  },
  {
    path: '/account/sending-domains',
    component: sendingDomains.ListPage,
    condition: hasGrants('sending_domains/manage'),
    layout: App,
    title: 'Sending Domains'
  },
  {
    path: '/account/sending-domains/create',
    component: sendingDomains.CreatePage,
    condition: hasGrants('sending_domains/manage'),
    layout: App,
    title: 'New Sending Domain'
  },
  {
    path: '/account/sending-domains/edit/:id',
    component: sendingDomains.EditPage,
    condition: hasGrants('sending_domains/manage'),
    layout: App,
    title: 'Edit Sending Domain'
  },
  {
    path: '/account/smtp',
    component: SmtpPage,
    condition: hasGrants('api_keys/manage'),
    layout: App,
    title: 'SMTP Settings'
  },
  {
    path: '/account/billing',
    component: SecretBillingPlanOrBillingSummaryPage,
    condition: all(hasGrants('account/manage'), not(isEnterprise), not(isHeroku), not(isAzure)),
    layout: App,
    title: 'Billing'
  },
  {
    path: '/account/billing/plan',
    component: billing.ChangePlanPage,
    condition: all(hasGrants('account/manage'), not(isEnterprise), not(isHeroku), not(isAzure)),
    layout: App,
    title: 'Billing | Change My Plan'
  },
  {
    path: '/account/ip-pools',
    component: ipPools.ListPage,
    condition: hasGrants('ip_pools/manage'),
    layout: App,
    title: 'IP Pools'
  },
  {
    path: '/account/ip-pools/create',
    component: ipPools.CreatePage,
    condition: hasGrants('ip_pools/manage'),
    layout: App,
    title: 'New IP Pool'
  },
  {
    path: '/account/ip-pools/edit/:id',
    component: ipPools.EditPage,
    condition: hasGrants('ip_pools/manage'),
    layout: App,
    title: 'Edit IP Pool'
  },
  {
    path: '/onboarding/plan',
    component: onboarding.ChoosePlan,
    condition: configFlag('featureFlags.has_signup'),
    title: 'Onboarding | Choose Your Plan'
  },
  {
    path: '/onboarding/sending-domain',
    component: onboarding.SendingDomainPage,
    condition: configFlag('featureFlags.has_signup'),
    title: 'Onboarding | Create a Sending Domain'
  },
  {
    path: '/onboarding/email',
    component: onboarding.SmtpOrApiPage,
    condition: configFlag('featureFlags.has_signup'),
    title: 'Onboarding | REST and SMTP'
  },
  {
    path: '/onboarding/email/smtp',
    component: onboarding.SmtpPage,
    condition: configFlag('featureFlags.has_signup'),
    title: 'Onboarding | Send a Test Email (SMTP)'
  },
  {
    path: '/onboarding/email/api',
    component: onboarding.ApiPage,
    condition: configFlag('featureFlags.has_signup'),
    title: 'Onboarding | Send a Test Email (REST)'
  },
  {
    path: '/support/aws-premium',
    component: PremiumSupportPage,
    condition: isAws,
    title: 'Support | Request Premium Support'
  }
];

// ensure 404 is always last in routes
routes.push({
  path: '*',
  component: PageNotFound,
  layout: App,
  title: 'Page Not Found'
});

export default routes;
