
export const HEALTH_SCORE_INFO = `
  This is a predictive score that monitors your email health to identify problems before they
  negagtively impact email delivery. This composite score is informed by message events, including
  bounces, spam trap hits, user engagement, and others.
`;

export const HEALTH_SCORE_COMPONENT_INFO = `
  Your email Health Score is comprised of several signals, including bounces, spam trap hits, user
  engagement, and others.
`;

export const HEALTH_SCORE_COMPONENTS = {
  'Block Bounces': `
    Block Bounces are defined as the share of attempted email injections that are undelivered for
    various policy reasons.
  `,
  Complaints: `
    Spam Complaints are defined as the shared of attempted email injections that are flagged by
    recipients as spam.
  `,
  'Hard Bounces': `
    Hard Bounces are calcuated as the share of attempted email injections that is sent to
    non-existent or undeliverable addresses.
  `,
  'List Quality': `
    List Quality is determined by the share of attempted email injections that match address
    patterns associated with problematic list procurement and hygiene practices.
  `,
  'Other bounces': `
    Other Bounces are defined as the share of attempted email injections that bounce for a variety
    of miscellaneous technical reasons.
  `,
  'Transient Failures': `
    Transient Failures are calcuated as the share of attempted email injections that exhibit
    temporary delivery problems.
  `
};

export const SPAM_TRAP_INFO = `
  This reports the share over time of your total email that has been sent to known spam traps. An
  excessive rate of spam trap hits is an indicator of poor list procurement and hygiene practices.
`;

export const ENGAGEMENT_RECENCY_INFO = `
  This reports the share over time of your email that has been sent to recipients who most recently
  opened messages or clicked links during several defined time periods.
`;

export const ENGAGEMENT_RECENCY_COHORTS = {
  'Never Engaged': `
    Never Engaged Recipients are the group of recipients who have received email but have not
    engaged with your messages in the past 365 days.
  `,
  New: `
    New Recipients are the group of recipients who have received their first email from you within
    the past 7 days and who have not yet engaged with your messages.
  `,
  'Not Recently Engaged': `
    Not Recently Engaged Recipients are the group of recipients who have engaged with your email
    in the past 365 days, but not in the past 90 days.
  `,
  'Recently Engaged': `
    Recently Engaged Recipients are the group of recipients who have engaged with your email in
    the past 14 days.
  `,
  'Semi Recently Engaged': `
    Semi-Recently Engaged Recipients are the group of recipients who have engaged with your email
    in the past 90 days, but not in the past 14 days.
  `
};