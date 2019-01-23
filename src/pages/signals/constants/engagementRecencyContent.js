import React, { Fragment } from 'react';

// Ordered by priority
const content = [
  {
    condition: ({ c_uneng }) => c_uneng > 0.15,
    content: (
      <Fragment>
        <strong>Too many of your recipients have been inactive for 365 days.</strong><br/>
        This low engagement may be hurting your email deliverability. You should remove subscribers that have not engaged in the past year and consider segmenting your list to better target interest groups and your most engaged recipients.
      </Fragment>
    ),
    type: 'bad',
    link: 'https://www.sparkpost.com/docs/signals/segmentation/'
  },
  {
    condition: ({ c_uneng }) => c_uneng > 0.05 && c_uneng <= 0.15,
    content: (
      <Fragment>
        <strong>Some recipients have been inactive for 365 days.</strong><br/>
        While it could be worse, this low engagement may be hurting your email deliverability. Consider implementing a list hygiene process.
      </Fragment>
    ),
    type: 'warning',
    link: 'https://www.sparkpost.com/docs/signals/list-hygiene/'
  },
  {
    condition: ({ c_new }) => c_new > 0.20,
    content: (
      <Fragment>
        <strong>A large number of new recipients have yet to engage.</strong><br/>
        This lack of engagement will have a negative impact on your reputation with mailbox providers. To reduce this, improve your email content and reevaluate your list acquisition practices.
      </Fragment>
    ),
    type: 'bad',
    link: 'https://www.sparkpost.com/docs/signals/subscriber-acquisition/'
  },
  {
    condition: ({ c_new }) => c_new > 0.10 && c_new <= 0.20,
    content: (
      <Fragment>
        <strong>Some new recipients have not yet engaged.</strong><br/>
        Consider a welcome campaign to make it easy for new subscribers to engage and get value from your email.
      </Fragment>
    ),
    type: 'warning',
    link: 'https://www.sparkpost.com/docs/signals/welcome-campaign/'
  },
  {
    condition: ({ c_365d }) => c_365d > 0.25,
    content: (
      <Fragment>
        <strong>A large portion of recipients are no longer engaging.</strong><br/>
        Removing inactive subscribers is the best way to maintain the quality of your list. First, however, consider sending them a reengagement series before saying goodbye.
      </Fragment>
    ),
    type: 'bad',
    link: 'https://www.sparkpost.com/docs/signals/re-engagement-campaign/'
  },
  {
    condition: ({ c_365d }) => c_365d > 0.10 && c_365d <= 0.25,
    content: (
      <Fragment>
        <strong>Many recipients are no longer engaging.</strong><br/>
        If this continues, you will risk hurting your performance. Consider segmenting your recipients and sending a reengagement series—and then removing those recipients who don’t respond.
      </Fragment>
    ),
    type: 'warning',
    link: 'https://www.sparkpost.com/docs/signals/content-refresh/'
  },
  {
    // condition: ({ c_90d }) => c_90d < 0.25,
    condition: () => false, // Copy does not accurately represent the condition
    content: (
      <Fragment>
        <strong>Your recipient engagement is dropping off significantly over time.</strong><br/>
        Even the most engaged recipients will get tired of repetitive or poorly timed messages. You should consider reevaluating your lifecycle strategy to shake things up and reengage your audience.
      </Fragment>
    ),
    type: 'bad',
    link: 'https://www.sparkpost.com/docs/signals/content-refresh/'
  },
  {
    // condition: ({ c_90d }) => c_90d >= 0.25 && c_90d < 0.35,
    condition: () => false, // Copy does not accurately represent the condition
    content: (
      <Fragment>
        <strong>Your recipient engagement is starting to drop off over time.</strong><br/>
        You should consider giving your subscribers options for what types of emails they receive.
      </Fragment>
    ),
    type: 'warning',
    link: 'https://www.sparkpost.com/docs/signals/preference-center/'
  },
  {
    condition: ({ c_14d }) => c_14d < 0.25,
    content: (
      <Fragment>
        <strong>Very few of your recipients have recently engaged.</strong><br/>
        Engagement is a key factor in how mailbox providers evaluate your reputation, and this low engagement may hurt your email deliverability. Be sure you're sending relevant and desired messages.
      </Fragment>
    ),
    type: 'bad',
    link: 'https://www.sparkpost.com/docs/deliverability/optimizing-deliverability-and-inbox-placement/'
  },
  {
    condition: ({ c_14d }) => c_14d >= 0.25 && c_14d < 0.35,
    content: (
      <Fragment>
        <strong>Not enough of your recipients have recently engaged with your email.</strong><br/>
        Engagement is a key factor in your reputation, and low engagement may hurt your email deliverability. Be sure you are sending relevant and desired messages.
      </Fragment>
    ),
    type: 'warning',
    link: 'https://www.sparkpost.com/docs/signals/engagement/'
  }
];

export default content;
