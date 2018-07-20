import React, { Fragment } from 'react';
import _ from 'lodash';
import { Page, Tag, UnstyledLink, ActionList, Popover, Select, Panel, Button, Label, Grid } from '@sparkpost/matchbox';
import { LabelledValue } from 'src/components'
import { reduxForm, Field } from 'redux-form';
import { TextFieldWrapper, CheckboxWrapper, RadioGroup, SelectWrapper } from 'src/components';
import { snakeToFriendly } from 'src/helpers/string';
import styles from '../DetailsPage.module.scss';

export const SettingsPanel = ({ test, formValues }) => {
  const isNotEditable = test.status === 'running' || test.status === 'cancelled' || test.status === 'completed';

  if (isNotEditable) {
    return (
      <Panel>
        <Panel.Section >
          <LabelledValue label='Test Mode' >
            <h6>{snakeToFriendly(test.test_mode)} </h6>

            {test.test_mode === 'bayesian' && <p className={styles.HelpText}>In bayesian mode, once this test has completed, the best performing template will be used in subsequent transmissions in place of the default.</p>}

            {test.test_mode === 'learning' && <p>In learning mode, once this test has completed, subsequent transmissions will revert to using the default template</p>}

          </LabelledValue>
          {
            (test.confidence_level && test.test_mode === 'bayesian') &&
            <LabelledValue label='Confidence Level' ><p>{test.confidence_level}</p></LabelledValue>
          }
        </Panel.Section>

        <Panel.Section>
          <LabelledValue label='Metric' ><p>{test.metric === 'count_unique_confirmed_opened' ? 'Open Rate' : 'Click Rate'} </p></LabelledValue>
          <LabelledValue label='Engagement Timeout' ><p>{`${test.engagement_timeout} hours`} </p></LabelledValue>
          <LabelledValue label='Distribution Method' ><p>{snakeToFriendly(test.audience_selection)} </p></LabelledValue>
          {
            test.total_sample_size &&
            <LabelledValue label='Total Sample Size' ><p><Unit unit='number' value={test.total_sample_size}/></p></LabelledValue>
          }
        </Panel.Section>

      </Panel>
    )
  }

  return (
    <div>
    <Panel>
      <Panel.Section>
        <Field name='testmode' component={RadioGroup} label='Select a Test Mode' options={[
          { label: 'Bayesian Mode', value: 'bayesian', helpText: 'Once the test completes, the best performing template will be used in subsequent transmissions in place of the default.'},
          { label: 'Learning Mode', value: 'learning', helpText: 'Once the test completes, the default template will be used in subsequent transmissions.' }
        ]} />
      </Panel.Section>
        {
          formValues.testmode === 'bayesian' && (
            <Panel.Section>
              <Field name='confidence_level' component={TextFieldWrapper} label='At what confidence level should we pick and start sending a winner?' />
            </Panel.Section>
          )
        }
    </Panel>
    <Panel>
      <Panel.Section>
        <Field name='engagement_metric' grid={{ xs: 6 }} component={RadioGroup} label='How should we determine a winning variant?' options={[
          { label: 'By Click Rate', value: 'clicks' },
          { label: 'By Open Rate', value: 'open' }
        ]} />
        <Field name='engagement_timeout' component={TextFieldWrapper} label='How long would you like to continue to collect engagement events after the last delivery?' helpText='By default, we continue to collect engagement events for 24 hours after the last delivery.' suffix='hours' />
      </Panel.Section>
    </Panel>
    <Panel>
      <Panel.Section>
        <Field name='audience_selection' grid={{ xs: 6 }} component={RadioGroup} label={'How should we distribute this test\'s variants?'} options={[
          { label: 'By Percent', value: 'percent' },
          { label: 'By Number of Messages', value: 'sample_size' }
        ]} />
        {
          formValues.audience_selection === 'sample_size' && (
              <Field name='sample_size' component={TextFieldWrapper} label='Total number of messages to send as part of the test' />
          )
        }
      </Panel.Section>
    </Panel>
    </div>
  );

}
