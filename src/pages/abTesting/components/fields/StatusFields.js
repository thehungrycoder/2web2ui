import React, { Fragment } from 'react';
import { Field } from 'redux-form';
import { Panel } from '@sparkpost/matchbox';
import { TextFieldWrapper } from 'src/components/reduxFormWrappers';
import { required, maxLength } from 'src/helpers/validation';

const StatusFields = ({ disabled }) => (
  <Fragment>
    <Panel sectioned>
      <Field
        name='name'
        component={TextFieldWrapper}
        label='Test Name'
        disabled={disabled}
        validate={[required, maxLength(64)]}
      />
    </Panel>
    <Panel sectioned>
      {/* TODO - add datepicker  */}
      <Field
        name='dates'
        component={TextFieldWrapper}
        helpText='A test may run for a maximum of 30 days'
        label='When should we run this test?'
        disabled={disabled}
        placeholder='Jul 31st 2018 11:02am – Aug 1st 2018 11:02am'
      />
    </Panel>
  </Fragment>
);

export default StatusFields;
