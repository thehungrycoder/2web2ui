import React from 'react';
import { connect } from 'react-redux';

import { reduxForm, Field } from 'redux-form';
import { Grid } from '@sparkpost/matchbox';
import { TextFieldWrapper, FilterDropdown } from 'src/components';

import { required } from 'src/helpers/validation';

export let EmailSearch = (props) => {
  const { handleSubmit, submitting, pristine, refresh, subaccounts = []} = props;

  return (
    <Grid>
      <Grid.Column xs={12} md={6}>
        <div className=''>
            <Field
                name='email'
                component={TextFieldWrapper}
                helpText={''}
                placeholder='Email'
                validate={[required]}
            />
        </div>
      </Grid.Column>
      <Grid.Column xs={12} md={6}>
        <div className=''>
            <FilterDropdown
                formName='emailSearchForm'
                options={subaccounts}
                namespace='subaccounts'
                displayValue='Subaccount'
            />
        </div>
      </Grid.Column>
    </Grid>
  );
};

const formName = 'emailSearchForm';

EmailSearch = reduxForm({
  form: formName
})(EmailSearch);

export default connect(null)(EmailSearch);
