import React, { Fragment } from 'react';
import { Field } from 'redux-form';
import { Panel } from '@sparkpost/matchbox';
import { TextFieldWrapper } from 'src/components/reduxFormWrappers';

const StatusFields = ({ disabled }) => {
  return (
    <Fragment>
      <Panel sectioned>
        <Field
          name='name'
          component={TextFieldWrapper}
          helpText='Internal use only'
          label='Test Name'
          disabled={disabled}
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
        />
      </Panel>
    </Fragment>
  )
}

export default StatusFields;
