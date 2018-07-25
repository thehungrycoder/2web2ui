import React from 'react';
import { Field } from 'redux-form';
import { Panel } from '@sparkpost/matchbox';
import { TextFieldWrapper, RadioGroup } from 'src/components/reduxFormWrappers';

const SettingsFields = ({ test, disabled, formValues = {}}) => {
  return (
    <div>
      <Panel>
        <Panel.Section>
          <Field
            name='test_mode'
            component={RadioGroup}
            label='Select a Test Mode'
            disabled={disabled}
            options={[
              {
                label: 'Bayesian Mode',
                value: 'bayesian',
                helpText: 'Once the test completes, the best performing template will be used in subsequent transmissions in place of the default.'
              },
              {
                label: 'Learning Mode',
                value: 'learning',
                helpText: 'Once the test completes, the default template will be used in subsequent transmissions.'
              }
            ]}
          />
        </Panel.Section>
          {
            formValues.test_mode === 'bayesian' && (
              <Panel.Section>
                <Field
                  name='confidence_level'
                  component={TextFieldWrapper}
                  label='At what confidence level should we pick and start sending a winner?'
                  disabled={disabled} />
              </Panel.Section>
            )
          }
      </Panel>
      <Panel>
        <Panel.Section>
          <Field
            name='metric'
            grid={{ xs: 6 }}
            component={RadioGroup}
            label='How should we determine a winning variant?'
            options={[
              { label: 'By Unique Click Rate', value: 'count_unique_clicked' },
              { label: 'By Unique Open Rate', value: 'count_unique_confirmed_opened' }
            ]}
            disabled={disabled}
          />
          <Field
            name='engagement_timeout'
            component={TextFieldWrapper}
            label='How long would you like to continue to collect engagement events after the last delivery?'
            helpText='By default, we continue to collect engagement events for 24 hours after the last delivery.'
            suffix='hours'
            disabled={disabled}
          />
        </Panel.Section>
      </Panel>
      <Panel>
        <Panel.Section>
          <Field
            name='audience_selection'
            grid={{ xs: 6 }}
            component={RadioGroup}
            label={'How should we distribute this test\'s variants?'}
            options={[
              { label: 'By Percent', value: 'percent' },
              { label: 'By Number of Messages', value: 'sample_size' }
            ]}
            disabled={disabled}
          />
          {formValues.audience_selection === 'sample_size' && (
            <Field
              name='total_sample_size'
              component={TextFieldWrapper}
              label='Total number of messages to send as part of the test'
              disabled={disabled}
            />
          )}
        </Panel.Section>
      </Panel>
    </div>
  )
}

export default SettingsFields;
