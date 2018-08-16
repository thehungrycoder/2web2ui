import React from 'react';
import { Panel } from '@sparkpost/matchbox';
import { LabelledValue } from 'src/components';
import { snakeToFriendly } from 'src/helpers/string';

import styles from './View.module.scss';

const SettingsView = ({ test }) => (
  <Panel>
    <Panel.Section >
      <LabelledValue label='Test Mode' >
        <h6>{snakeToFriendly(test.test_mode)}</h6>
        {
          test.test_mode === 'bayesian' &&
          <p className={styles.HelpText}>In bayesian mode, once this test has completed, the best performing template will be used in subsequent transmissions in place of the default.</p>
        }
        {
          test.test_mode === 'learning' &&
          <p className={styles.HelpText}>In learning mode, once this test has completed, subsequent transmissions will revert to using the default template</p>
        }
      </LabelledValue>
      {
        (test.confidence_level && test.test_mode === 'bayesian') &&
        <LabelledValue label='Confidence Level' ><p>{test.confidence_level}</p></LabelledValue>
      }
    </Panel.Section>
    <Panel.Section>
      <LabelledValue label='Metric' ><p>{test.metric === 'count_unique_confirmed_opened' ? 'Unique Open Rate' : 'Unique Click Rate'} </p></LabelledValue>
      {
        test.engagement_timeout &&
        <LabelledValue label='Engagement Timeout' ><p>{`${test.engagement_timeout.toLocaleString()} hours`} </p></LabelledValue>
      }
      <LabelledValue label='Distribution Method' ><p>{snakeToFriendly(test.audience_selection)}</p></LabelledValue>
      {
        test.total_sample_size &&
        <LabelledValue label='Total Sample Size' ><p>{test.total_sample_size.toLocaleString()}</p></LabelledValue>
      }
    </Panel.Section>
  </Panel>
);

export default SettingsView;
