import React from 'react';

const content = {
  'List Quality': (
    <span><strong>You're sending to a high rate of problematic email addresses.</strong> List quality can be an early determinant of deliverability issues to come. Improving it can help improve your email deliverability and engagement by reducing spam foldering, delays, and blocked messages.</span>
  ),
  'Hard Bounces': (
    <span><strong>You have a high rate of hard bounces.</strong> They could simply be typos or old addresses that once existed but have been abandoned and the account deleted by the mailbox provider. Removing these non-existent addresses from your recipient lists could improve your overall email deliverability.</span>
  ),
  'Block Bounces': (
    <span><strong>You have a high rate of block bounces.</strong> These bounces can be temporary or permanent and are the result of a low reputation at mailbox providers. You may need to contact the postmaster to request mitigation once you make changes to improve your reputation.</span>
  ),
  'Complaints': (
    <span><strong>Your email has an unusually high rate of spam complaints.</strong> These complaints by recipients have a strong negative impact on your overall email deliverability and point to the fact you should make improvements to your list. You should take steps to improve your list hygiene and email content.</span>
  ),
  'Transient Failures': (
    <span><strong>You are experiencing a high level of temporary bounces.</strong> These delays in email delivery have varied causes, but may be a sign of low reputation at mailbox providers since senders with good reputations may have their messages accepted before others. This can be an early warning sign of other issues to come such as spam foldering or block bouncing.</span>
  ),
  'Other bounces': (
    <span><strong>Your emails are being blocked without a clear reason.</strong> These bounces have varied causes, but improving your list quality can help resolve many bounce types.</span>
  )
};

export default content;
