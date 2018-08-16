import React, { Fragment } from 'react';
import { Field } from 'redux-form';
import { Panel } from '@sparkpost/matchbox';
import { AccessTime } from '@sparkpost/matchbox-icons';
import { TextFieldWrapper, DatePickerWrapper } from 'src/components/reduxFormWrappers';
import { required, maxLength, minLength, abTestDuration, startTimeAfterNow } from 'src/helpers/validation';

const StatusFields = ({ disabled }) => (
  <Fragment>
    <Panel sectioned>
      <Field
        name='name'
        component={TextFieldWrapper}
        label='Test Name'
        disabled={disabled}
        validate={[required, minLength(1), maxLength(64)]}
      />
    </Panel>
    <Panel sectioned>
      <Field
        component={DatePickerWrapper}
        disabled={disabled}
        name='dates'
        left
        showPresets={false}
        roundToPrecision={false}
        preventFuture={false}
        fromSelectsNextHour={true}
        validate={[abTestDuration, startTimeAfterNow]}
        textFieldProps={{
          helpText: 'A test may run for a maximum of 30 days',
          label: 'When should we run this test?',
          prefix: <AccessTime />
        }}
        datePickerProps={{
          disabledDays: { before: new Date() },
          initialMonth: new Date(),
          toMonth: null,
          fromMonth: new Date()
        }}
      />
    </Panel>
  </Fragment>
);

export default StatusFields;
