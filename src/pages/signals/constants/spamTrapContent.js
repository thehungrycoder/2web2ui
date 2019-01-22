import React, { Fragment } from 'react';

const content = [
  {
    condition: (n) => n < 0.0005,
    content: (
      <Fragment>
        <strong>You are sending email to few or no spam traps.</strong><br/>
        Good job with your list hygiene practices!
      </Fragment>
    ),
    type: 'good'
  },
  {
    condition: (n) => n >= 0.0005 && n < 0.001,
    content: (
      <Fragment>
        <strong>You are hitting some spam traps that could lead to future deliverability issues.</strong><br/>
        There are ways to accomplish a healthy list of engaged subscribers. It's key that you keep your subscribers engaged and that you remove unengaged recipients and replace them with new subscribers who are interested in your email.
      </Fragment>
    ),
    type: 'warning',
    link: 'https://www.sparkpost.com/docs/signals/engagement/'
  },
  {
    condition: (n) => n >= 0.001 && n < 0.01,
    content: (
      <Fragment>
        <strong>You are sending email to a large number of known spam traps.</strong><br/>
        Hitting spam traps is an indicator of poor list procurement and hygiene practices and has a strong negative impact on your overall email deliverability. You should take steps to improve your list hygiene.
      </Fragment>
    ),
    type: 'bad',
    link: 'https://www.sparkpost.com/docs/signals/list-hygiene/'
  },
  {
    condition: (n) => n >= 0.01,
    content: (
      <Fragment>
        <strong>You are sending email to a very large number of known spam traps.</strong><br/>
        Hitting spam traps is an indicator of poor list procurement and hygiene practices and has a strong negative impact on your overall email deliverability. You should take steps to improve your list hygiene immediately.
      </Fragment>
    ),
    type: 'bad',
    link: 'https://www.sparkpost.com/docs/signals/subscriber-acquisition/'
  }
];

export default content;
