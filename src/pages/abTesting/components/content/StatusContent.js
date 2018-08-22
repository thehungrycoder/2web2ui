import React from 'react';
import { UnstyledLink } from '@sparkpost/matchbox';

const StatusContent = ({ test, rescheduling }) => (
  <div>
    {
      (test.status === 'draft' || rescheduling) && <div><p>You can update your Test Name and select a start time and end time to schedule your A/B Test.</p>
      </div>
    }
    {
      test.status === 'scheduled' && <div>
        <p>This test has been scheduled. You can update your Test Name, start time, or end time.</p>
      </div>

    }
    {
      test.status === 'running' && <div>
        <p>This test is currently running. It will conclude when either:</p>
        <ul>
          <li>the end date + engagement timeout period is reached</li>
          {test.test_mode === 'bayesian' && <li>the desired confidence level has been reached</li>}
          <li>the desired sample size limit is reached + engagement timeout period is reached</li>
        </ul>
      </div>

    }
    {
      test.status === 'cancelled' && !rescheduling && <div>
        <p>This test run was cancelled. To re-run this test, click "Edit and Reschedule Test".</p>
      </div>

    }
    {
      test.status === 'completed' && !rescheduling && test.test_mode === 'learning' && <p>This test has concluded and it now sending the default template. You may override the default with a new one without starting a new test. This test was started and completed at the times shown.</p>
    }
    {
      test.status === 'completed' && !rescheduling && test.test_mode === 'bayesian' && test.winning_template_id !== test.default_template.template_id && <p>This test has concluded and it now sending the winning template. You may override it with a new one without starting a new test. This test was started and completed at the times shown.</p>
    }
    {
      test.status === 'completed' && !rescheduling && test.test_mode === 'bayesian' && test.winning_template_id === test.default_template.template_id && <p>This test has concluded and it now sending the default template. You may override it with a new one without starting a new test. This test was started and completed at the times shown.</p>
    }
    {
      (test.status !== 'completed' || rescheduling) && <p><span>You can read about the different A/B Test states </span><UnstyledLink external to='https://www.sparkpost.com/docs/tech-resources/a-b-testing-sparkpost/#ab-testing-states'>here</UnstyledLink>.</p>
    }
  </div>
);

export default StatusContent;
