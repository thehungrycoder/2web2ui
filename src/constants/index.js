export const DEFAULT_REDIRECT_ROUTE = '/landing';
export const AFTER_JOIN_REDIRECT_ROUTE = '/onboarding/plan';
export const SIGN_UP_ROUTE = '/join';
export const AUTH_ROUTE = '/auth';
export const TFA_ROUTE = '/auth/tfa';
export const ENABLE_TFA_AUTH_ROUTE = '/auth/enable-tfa';
export const SSO_AUTH_ROUTE = '/auth/sso';

export const COOKIE_DOMAIN = '.sparkpost.com';

export const FORMATS = {
  DATE: 'MMM Do',
  LONG_DATE: 'MMM Do YYYY',
  SHORT_DATE: 'YYYY-MM-DD',

  TIME: 'h:mma',
  MILITARY_TIME: 'H:mm',
  ANTE_MILITARY_TIME: 'H:mma', // for 24 hour accidentally including am/pm (FE-61)

  DATETIME: 'MMM Do h:mma',
  LONG_DATETIME: 'MMM Do YYYY h:mma',

  INPUT_DATES: ['YYYY-MM-DD'],
  INPUT_TIMES: ['h:mma', 'H:mm', 'H:mma'],
  INPUT_DATETIMES: ['YYYY-MM-DD h:mma', 'YYYY-MM-DD H:mm', 'YYYY-MM-DD H:mma']
};

export const LINKS = {
  SPC_EU_URL: 'https://app.eu.sparkpost.com',
  SPC_US_URL: 'https://app.sparkpost.com',
  SP_HOME_PAGE: 'https://www.sparkpost.com',
  API_DOCS: 'https://developers.sparkpost.com/api',
  DOCS: 'https://www.sparkpost.com/docs',
  PREMIUM_SUPPORT: 'https://www.sparkpost.com/contact-premium',
  ENTERPRISE_SUPPORT: 'https://www.sparkpost.com/contact-enterprise',
  RECIP_API: 'https://developers.sparkpost.com/api/recipient-lists.html',
  AB_TESTING_API: 'https://developers.sparkpost.com/api/ab-testing.html',
  SUBACCOUNTS_API: 'https://developers.sparkpost.com/api/subaccounts.html',
  TOU: 'https://www.sparkpost.com/policies/tou',
  DOMAIN_VERIFICATION: 'https://www.sparkpost.com/docs/tech-resources/enabling-multiple-custom-tracking-domains',
  SENDING_REQS: 'https://www.sparkpost.com/docs/getting-started/requirements-for-sending-domains',
  SENDING_SETUP: 'https://www.sparkpost.com/docs/getting-started/setting-up-domains/',
  SUPPRESSION_MIGRATION: 'https://www.sparkpost.com/docs/getting-started/getting-started-sparkpost/#important-coming-from-other-email-services',
  TFA_BACKUP_CODES: 'https://support.sparkpost.com/customer/portal/articles/1948449',
  IP_WARM_UP: 'https://support.sparkpost.com/customer/portal/articles/1972209-ip-warm-up-overview',
  DAILY_USAGE: 'https://www.sparkpost.com/docs/getting-started/what-counts-daily-monthly-usage',
  LEARN_MORE_TFA: 'https://www.sparkpost.com/docs/my-account-and-profile/enabling-two-factor-authentication',
  ONBOARDING_SENDING: 'https://www.sparkpost.com/docs/getting-started/getting-started-sparkpost/#preparing-your-from-address',
  SUBMIT_SUPPORT_TICKET: 'https://support.sparkpost.com/customer/portal/emails/new',
  RECAPTCHA_LIB_URL: 'https://www.google.com/recaptcha/api.js',
  DAILY_MONTHLY_QUOTA_LIMIT_DOC: 'https://support.sparkpost.com/customer/portal/articles/2030894',
  GETTING_STARTED_GUIDE: 'https://www.sparkpost.com/docs/getting-started/getting-started-sparkpost',
  ADMIN_BOUNCE: 'https://support.sparkpost.com/', // TODO Add this to the bounce page
  SSO_GUIDE: 'https://www.sparkpost.com/docs/my-account-and-profile/sso',
  ALERTS_DOCS: 'https://developers.sparkpost.com/api/alerts/#alerts-post-create-an-alert',
  ALERTS_SURVEY: 'https://goo.gl/forms/rnIuTvdVF2xhpKCy2',
  SNIPPET_SUBSTITUTION_REFERENCE: 'https://developers.sparkpost.com/api/substitutions-reference/#header-snippets',
  MANDATORY_TFA: 'https://www.sparkpost.com/docs/my-account-and-profile/enabling-two-factor-authentication/'
};

export const ENTERPRISE_PLAN_CODES = ['ent1'];

export const AWS_COOKIE_NAME = 'aws-mkt';

export const DAILY_LIMIT_REQUEST_TEMPLATE = 'daily-limit-increase';

export const SPC_EU_TENANT = 'spceu';
export const SPC_TENANT = 'spc';

export const CROSS_LINK_MAP = {
  [SPC_TENANT]: { label: '', url: LINKS.SPC_US_URL },
  [SPC_EU_TENANT]: { label: 'EU', url: LINKS.SPC_EU_URL }
};

export const TYPEAHEAD_LIMIT = 100;
export const METRICS_API_LIMIT = 1000;

export const FORMS = {
  LOGIN: 'loginForm',
  SSO: 'ssoLoginForm',
  JOIN: 'joinForm',
  JOIN_PLAN: 'joinPlanForm',
  JOIN_SENDING_DOMAIN: 'joinSendingDomainForm',
  EDIT_USER: 'userEditForm',
  EVENTS_SEARCH: 'eventsSearchForm'
};

export const EVENTS_SEARCH_FILTERS = {
  recipient_domains: { placeholder: 'list of domain parts (e.g., gmail, yahoo.co, yahoo.co.jp, .fr)', label: 'Recipient Domains' },
  from_addresses: { placeholder: 'list of full from addresses (e.g., john@mycompany.com)', label: 'From Addresses' },
  sending_domains: { placeholder: 'list of domain parts (e.g., joespizza, marketing.joespizza)', label: 'Sending Domains' },
  subjects: { placeholder: 'list of full words (e.g. happy birthday, christmas)', label: 'Subjects' },
  bounce_classes: { placeholder: 'list of bounce classification codes (e.g. 10, 30)', label: 'Bounce Classes' },
  reasons: { placeholder: 'list of full words in raw reasons (e.g. 5.4.7, IP, Mail rejected)', label: 'Reasons' },
  campaigns: { placeholder: 'list of full words in campaign ids (e.g. newsletter, fire-sale)', label: 'Campaign IDs' },
  templates: { placeholder: 'list of full words in template ids (e.g. newsletter, fire-sale)', label: 'Template IDs' },
  sending_ips: { placeholder: 'list of ip addresses (e.g., 10.0.0.4.25)', label: 'Sending IPs' },
  ip_pools: { placeholder: 'list of full words in ip pool id (e.g billing, administrative)', label: 'IP Pools' },
  subaccounts: { placeholder: 'list of subaccount ids (e.g. 346, 823)', label: 'Subaccount IDs' },
  messages: { placeholder: 'list of message ids (e.g. 00129004225c33cc4c45)', label: 'Message IDs' },
  transmissions: { placeholder: 'list of transmission ids (e.g. 337221619334066426)', label: 'Transmissions IDs' },
  ab_tests: { placeholder: 'list of full words in ab test ids (e.g. newsletter, fire-sale)', label: 'AB Test IDs' },
  ab_test_versions: { placeholder: 'list of version numbers; requires AB Test ID filter(e.g. 4)', label: 'AB Test Versions' }
};
export const DEFAULT_PER_PAGE_BUTTONS = [10, 25, 50, 100];

export const ANALYTICS_CREATE_ACCOUNT = 'create account';
export const ANALYTICS_ADDON_IP = 'dedicated_ips';
export const ANALYTICS_PREMIUM_SUPPORT = 'premium-support';
export const ANALYTICS_ENTERPRISE_SUPPORT = 'enterprise-support';
export const ANALYTICS_ONBOARDING = 'onboarding';
export const ANALYTICS_ONBOARDING_LEARN_MORE = 'learn-more-sending-domains';
export const ANALYTICS_ONBOARDING_CREATE_DOMAIN = 'create-sending-domain-verify-';
export const ANALYTICS_WHITELISTED_FORMS = [
  FORMS.LOGIN,
  FORMS.JOIN,
  FORMS.JOIN_PLAN,
  FORMS.JOIN_SENDING_DOMAIN
];
