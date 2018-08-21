import React, { Fragment } from 'react';

import { UnstyledLink } from '@sparkpost/matchbox';

const SettingsContent = ({ test }) => (
  <div>
    {
      test.status === 'draft' && <Fragment>
        <p>You may continue to adjust these settings and template variants while this test is in draft mode.</p>

        <p><UnstyledLink external to='https://www.sparkpost.com/docs/tech-resources/a-b-testing-sparkpost/'>Learn more about configuring AB tests</UnstyledLink>.</p>
      </Fragment>
    }
  </div>
);

export default SettingsContent;
