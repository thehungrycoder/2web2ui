import React, { Fragment } from 'react';
import { Field } from 'redux-form';
import { Panel } from '@sparkpost/matchbox';
import { AccessTime } from '@sparkpost/matchbox-icons';
import { TextFieldWrapper } from 'src/components/reduxFormWrappers';
import DatePicker from 'src/components/datePicker/DatePicker';

const DateFieldWrapper = ({ input, ...rest }) => (
  // TODO - pass through validation error
  <DatePicker
    onChange={input.onChange}
    to={input.value.to}
    from={input.value.from}
    {...rest} />
);

const StatusFields = ({ disabled }) => (
  <Fragment>
    <Panel sectioned>
      <Field
        name='name'
        component={TextFieldWrapper}
        label='Test Name'
        disabled={disabled}
      />
    </Panel>
    <Panel sectioned>
      <Field
        component={DateFieldWrapper}
        disabled={disabled}
        name='dates'
        left
        showPresets={false}
        textFieldProps={{
          helpText: 'A test may run for a maximum of 30 days',
          label: 'When should we run this test?',
          labelHidden: false,
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
