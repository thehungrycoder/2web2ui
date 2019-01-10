import React from 'react';

const content = [
  {
    condition: (n) => n < 0.0005,
    content: (
      <span>
        <strong>You are sending email to few or no spam traps.</strong> Good job with your list hygiene practices!
      </span>
    ),
    type: 'good'
  },
  {
    condition: (n) => n >= 0.0005 && n < 0.001,
    content: (
      <span>
        <strong>You are hitting some spam traps that could lead to future deliverability issues.</strong> There are ways to accomplish a healthy list of engaged subscribers. It's key that you keep your subscribers engaged and that you remove unengaged recipients and replace them with new subscribers who are interested in your email.
      </span>
    ),
    type: 'warning'
  },
  {
    condition: (n) => n >= 0.001 && n < 0.01,
    content: (
      <span>
        <strong>You are sending email to a large number of known spam traps.</strong> Hitting spam traps is an indicator of poor list procurement and hygiene practices and has a strong negative impact on your overall email deliverability. You should take steps to improve your list hygiene.
      </span>
    ),
    type: 'bad'
  },
  {
    condition: (n) => n >= 0.01,
    content: (
      <span>
        <strong>You are sending email to a very large number of known spam traps.</strong> Hitting spam traps is an indicator of poor list procurement and hygiene practices and has a strong negative impact on your overall email deliverability. You should take steps to improve your list hygiene immediately.
      </span>
    ),
    type: 'bad'
  }
];

export default content;
