import React from 'react';

// Ordered by priority
const content = [
  {
    condition: ({ c_uneng }) => c_uneng > 0.15,
    content: (
      <span><strong>Too many of your recipients have been inactive for 365 days.</strong> This low engagement may be hurting your email deliverability. You should remove subscribers that have not engaged in the past year and consider segmenting your list to better target interest groups and your most engaged recipients.</span>
    ),
    type: 'bad',
    link: 'https://www.sparkpost.com/docs/signals/segmentation/'
  },
  {
    condition: ({ c_uneng }) => c_uneng > 0.05 && c_uneng <= 0.15,
    content: (
      <span><strong>Some recipients have been inactive for 365 days.</strong> While it could be worse, this low engagement may be hurting your email deliverability. Consider implementing a list hygiene process.</span>
    ),
    type: 'warning',
    link: 'https://www.sparkpost.com/docs/signals/list-hygiene/'
  },
  {
    condition: ({ c_new }) => c_new > 0.20,
    content: (
      <span><strong>A large number of new recipients have yet to engage.</strong> This lack of engagement will have a negative impact on your reputation with mailbox providers. To reduce this, improve your email content and reevaluate your list acquisition practices.</span>
    ),
    type: 'bad',
    link: 'https://www.sparkpost.com/docs/signals/subscriber-acquisition/'
  },
  {
    condition: ({ c_new }) => c_new > 0.10 && c_new <= 0.20,
    content: (
      <span><strong>Some new recipients have not yet engaged.</strong> Consider a welcome campaign to make it easy for new subscribers to engage and get value from your email.</span>
    ),
    type: 'warning',
    link: 'https://www.sparkpost.com/docs/signals/welcome-campaign/'
  },
  {
    condition: ({ c_365d }) => c_365d > 0.25,
    content: (
      <span><strong>A large portion of recipients are no longer engaging.</strong> Removing inactive subscribers is the best way to maintain the quality of your list. First, however, consider sending them a reengagement series before saying goodbye.</span>
    ),
    type: 'bad',
    link: 'https://www.sparkpost.com/docs/signals/re-engagement-campaign/'
  },
  {
    condition: ({ c_365d }) => c_365d > 0.10 && c_365d <= 0.25,
    content: (
      <span><strong>Many recipients are no longer engaging.</strong> If this continues, you will risk hurting your performance. Consider segmenting your recipients and sending a reengagement series—and then removing those recipients who don’t respond.</span>
    ),
    type: 'warning',
    link: 'https://www.sparkpost.com/docs/signals/content-refresh/'
  },
  {
    condition: ({ c_90d }) => c_90d < 0.25,
    content: (
      <span><strong>Your recipient engagement is dropping off significantly over time.</strong> Even the most engaged recipients will get tired of repetitive or poorly timed messages. You should consider reevaluating your lifecycle srategy to shake things up and reengage your audience.</span>
    ),
    type: 'bad',
    link: 'https://www.sparkpost.com/docs/signals/content-refresh/'
  },
  {
    condition: ({ c_90d }) => c_90d >= 0.25 && c_90d < 0.35,
    content: (
      <span><strong>Many recipients are no longer engaging.</strong> If this continues, you will risk hurting your performance. Consider segmenting your recipients and sending a reengagement series—and then removing those recipients who don’t respond.</span>
    ),
    type: 'warning',
    link: 'https://www.sparkpost.com/docs/signals/preference-center/'
  },
  {
    condition: ({ c_14d }) => c_14d < 0.25,
    content: (
      <span><strong>Very few of your recipients have recently engaged.</strong> Engagement is a key factor in how mailbox providers evaluate your reputation, and this low engagement may hurt your email deliverability. Be sure you're sending relevant and desired messages.</span>
    ),
    type: 'bad',
    link: 'https://www.sparkpost.com/docs/deliverability/optimizing-deliverability-and-inbox-placement/'
  },
  {
    condition: ({ c_14d }) => c_14d >= 0.25 && c_14d < 0.35,
    content: (
      <span><strong>Not enough of your recipients have recently engaged with your email.</strong> Engagement is a key factor in your reputation, and low engagement may hurt your email deliverability. Be sure you are sending relevant and desired messages.</span>
    ),
    type: 'warning',
    link: 'https://www.sparkpost.com/docs/signals/engagement/'
  }
];

export default content;
