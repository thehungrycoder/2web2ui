import React, { Fragment } from 'react';

const content = {
  'List Quality': {
    content: (
      <span><strong>You're sending to a high rate of problematic email addresses.</strong> List quality can be an early determinant of deliverability issues to come. Improving it can help improve your email deliverability and engagement by reducing spam foldering, delays, and blocked messages.</span>
    ),
    link: 'https://www.sparkpost.com/docs/signals/list-quality/'
  },
  'Hard Bounces': {
    content: (
      <span><strong>You have a high rate of hard bounces.</strong> They could simply be typos or old addresses that once existed but have been abandoned and the account deleted by the mailbox provider. Removing these non-existent addresses from your recipient lists could improve your overall email deliverability.</span>
    ),
    link: 'https://www.sparkpost.com/docs/signals/subscriber-acquisition/'
  },
  'Block Bounces': {
    content: (
      <span><strong>You have a high rate of block bounces.</strong> These bounces can be temporary or permanent and are the result of a low reputation at mailbox providers. You may need to contact the postmaster to request mitigation once you make changes to improve your reputation.</span>
    ),
    link: 'https://www.sparkpost.com/docs/signals/reputation-improvement/'
  },
  'Complaints': {
    content: (
      <span><strong>Your email has an unusually high rate of spam complaints.</strong> These complaints by recipients have a strong negative impact on your overall email deliverability and point to the fact you should make improvements to your list. You should take steps to improve your list hygiene and email content.</span>
    ),
    link: 'https://www.sparkpost.com/docs/signals/content-refresh/'
  },
  'Transient Failures': {
    content: (
      <span><strong>You are experiencing a high level of temporary bounces.</strong> These delays in email delivery have varied causes, but may be a sign of low reputation at mailbox providers since senders with good reputations may have their messages accepted before others. This can be an early warning sign of other issues to come such as spam foldering or block bouncing.</span>
    ),
    link: 'https://www.sparkpost.com/docs/signals/reputation-improvement/'
  },
  'Other bounces': {
    content: (
      <span><strong>Your emails are being blocked without a clear reason.</strong> These bounces have varied causes, but improving your list quality can help resolve many bounce types.</span>
    ),
    link: 'https://www.sparkpost.com/docs/signals/list-quality/'
  },
  'eng cohorts: new, 14-day': {
    content: (
      <Fragment>
        <strong>Not enough of your recipients have recently engaged with your email.</strong><br/>
        Engagement is a key factor in your reputation, and low engagement may hurt your email deliverability. Be sure you are sending relevant and desired messages.
      </Fragment>

    ),
    link: 'https://www.sparkpost.com/docs/signals/engagement/'
  },
  'eng cohorts: unengaged': {
    content: (
      <Fragment>
        <strong>Too many of your recipients have been inactive for 365 days.</strong><br/>
        This low engagement may be hurting your email deliverability. You should remove subscribers that have not engaged in the past year and consider segmenting your list to better target interest groups and your most engaged recipients.
      </Fragment>

    ),
    link: 'https://www.sparkpost.com/docs/signals/segmentation/'
  }
};

export default content;
