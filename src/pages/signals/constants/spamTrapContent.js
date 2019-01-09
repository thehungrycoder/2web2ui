import React from 'react';

const content = [
  {
    condition: (n) => n > 0.01,
    content: (
      <span>
        <strong>You are sending email to a very large number of known spam traps.</strong> Hitting spam traps is an indicator of poor list procurement and hygiene practices and has a strong negative impact on your overall email deliverability. You should take steps to improve your list hygiene immediately.
      </span>
    ),
    type: 'bad'
  },
  {
    condition: (n) => n > 0.001,
    content: (
      <span>
        <strong>You are sending email to a large number of known spam traps.</strong> Hitting spam traps is an indicator of poor list procurement and hygiene practices and has a strong negative impact on your overall email deliverability. You should take steps to improve your list hygiene.
      </span>
    ),
    type: 'bad'
  },
  {
    condition: (n) => n > 0.0005,
    content: (
      <span>
        <strong>You are sending email to at least a few known spam traps.</strong> Hitting spam traps can be the result of poor list hygiene practices and has a negative impact on your overall email deliverability.
      </span>
    ),
    type: 'warning'
  },
  {
    content: (
      <span>
        <strong>You are sending email to few or no spam traps.</strong> Good job with your list hygiene practices! Learn more about spam traps.
      </span>
    ),
    type: 'good'
  }
];

export default content;
